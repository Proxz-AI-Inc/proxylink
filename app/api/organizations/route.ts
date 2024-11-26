import { NextRequest, NextResponse } from 'next/server';
import {
  getFirestore,
  Firestore,
  Query,
  CollectionReference,
} from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { CURRENT_SCHEMA_VERSION, Tenant, TenantType } from '@/lib/db/schema';
import { parseErrorMessage } from '@/utils/general';
import { Organization } from '@/lib/api/organization';
import { sendEmailInvitation } from '@/lib/email/utils';
import { v4 as uuidv4 } from 'uuid';
import * as logger from '@/lib/logger/logger';

/**
 * Handles GET requests to fetch all organizations and their stats.
 * @returns {Promise<NextResponse>} A response containing organizations data or an error message.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const email = request.headers.get('x-user-email') ?? 'anonymous';
  const tenantId = request.headers.get('x-tenant-id') ?? 'system';
  const tenantType =
    (request.headers.get('x-tenant-type') as TenantType) ?? 'management';

  // Get query parameters
  const url = new URL(request.url);
  const params = {
    type: url.searchParams.get('type') as 'provider' | 'proxy' | null,
    cursor: url.searchParams.get('cursor'),
    limit: parseInt(url.searchParams.get('limit') ?? '10'),
  };

  try {
    initializeFirebaseAdmin();
    const db: Firestore = getFirestore();

    // Start with base query
    const tenantsRef: CollectionReference = db.collection('tenants');
    let query: Query = tenantsRef;

    // Add type filter if provided
    if (params.type) {
      query = query.where('type', '==', params.type);
    }

    // Order by name for consistent pagination
    query = query.orderBy('name');

    // Add cursor if provided
    if (params.cursor) {
      const cursorDoc = await tenantsRef.doc(params.cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    // Get total count (only on first page)
    let totalCount = 0;
    if (!params.cursor) {
      const countSnapshot = await query.count().get();
      totalCount = countSnapshot.data().count;
    }

    // Get one extra item to check for next page
    const tenantsSnapshot = await query.limit(params.limit + 1).get();
    const tenantDocs = tenantsSnapshot.docs;

    // Check if there's a next page
    const hasMore = tenantDocs.length > params.limit;
    if (hasMore) {
      tenantDocs.pop(); // Remove the extra item
    }

    const tenants = tenantDocs.map(
      doc => ({ id: doc.id, ...doc.data() }) as Tenant,
    );

    // Get stats for each tenant
    const stats: Organization[] = await Promise.all(
      tenants.map(async tenant => {
        const usersSnapshot = await db
          .collection('users')
          .where('tenantId', '==', tenant.id)
          .get();
        const userCount = usersSnapshot.size;

        const requestCount = (
          await db
            .collection('requests')
            .where(
              tenant.type === 'proxy' ? 'proxyTenantId' : 'providerTenantId',
              '==',
              tenant.id,
            )
            .count()
            .get()
        ).data().count;

        const connectedTenantsSnapshot = await db
          .collection('requests')
          .where(
            tenant.type === 'proxy' ? 'proxyTenantId' : 'providerTenantId',
            '==',
            tenant.id,
          )
          .select(
            tenant.type === 'proxy' ? 'providerTenantId' : 'proxyTenantId',
          )
          .get();

        const connectedTenantIds = new Set(
          connectedTenantsSnapshot.docs.map(doc =>
            tenant.type === 'proxy'
              ? doc.data().providerTenantId
              : doc.data().proxyTenantId,
          ),
        );

        // Get connected tenants info
        const connectedTenants = (
          await Promise.all(
            Array.from(connectedTenantIds).map(id =>
              db.collection('tenants').doc(id).get(),
            ),
          )
        )
          .filter(doc => doc.exists)
          .map(doc => ({ id: doc.id, name: doc.data()?.name }));

        return {
          id: tenant.id,
          name: tenant.name,
          type: tenant.type,
          userCount,
          requestCount,
          connectedTenants,
          adminEmails: tenant.admins,
          requiredCustomerInfo: tenant.requiredCustomerInfo,
          active: tenant.active,
        };
      }),
    );

    logger.info('Successfully fetched organizations stats', {
      email,
      tenantId,
      tenantType,
      method: 'GET',
      route: '/api/organizations',
      statusCode: 200,
    });

    return NextResponse.json({
      items: stats,
      nextCursor: hasMore ? tenantDocs[tenantDocs.length - 1].id : null,
      totalCount,
    });
  } catch (error) {
    logger.error('Failed to fetch organizations stats', {
      email,
      tenantId,
      tenantType,
      method: 'GET',
      route: '/api/organizations',
      statusCode: 500,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    });

    return NextResponse.json(
      { error: 'Error fetching tenant stats: ' + parseErrorMessage(error) },
      { status: 500 },
    );
  }
}

/**
 * Handles POST requests to create a new organization.
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} A response containing the created organization or an error message.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const email = request.headers.get('x-user-email') ?? 'anonymous';
  const tenantId = request.headers.get('x-tenant-id') ?? 'system';
  const tenantType =
    (request.headers.get('x-tenant-type') as TenantType) ?? 'management';

  try {
    initializeFirebaseAdmin();
    const db: Firestore = getFirestore();

    const { orgName, adminEmails, orgType, authFields, requestTypes } =
      await request.json();

    const newTenant: Tenant = {
      id: uuidv4(),
      version: CURRENT_SCHEMA_VERSION,
      name: orgName,
      type: orgType,
      createdAt: new Date().toISOString(),
      active: false,
      requiredCustomerInfo: authFields,
      saveOffers: [],
      admins: adminEmails,
      requestTypes,
    };

    await db.collection('tenants').doc(newTenant.id).set(newTenant);

    // Invite all admins
    const invitePromises = adminEmails.map((email: string) =>
      sendEmailInvitation({
        sendTo: email,
        isAdmin: true,
        invitedBy: 'john@proxylink.co',
        tenantType: orgType,
        tenantName: orgName,
        tenantId: newTenant.id,
      }),
    );

    await Promise.all(invitePromises);

    logger.info('Organization created successfully', {
      email,
      tenantId,
      tenantType,
      method: 'POST',
      route: '/api/organizations',
      statusCode: 201,
    });

    return NextResponse.json(
      {
        message: `Organization created and invitation${
          adminEmails.length > 1 ? 's' : ''
        } sent successfully`,
        tenant: newTenant,
      },
      { status: 201 },
    );
  } catch (error) {
    logger.error('Failed to create organization', {
      email,
      tenantId,
      tenantType,
      method: 'POST',
      route: '/api/organizations',
      statusCode: 500,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    });

    return NextResponse.json(
      { error: 'Error creating tenant: ' + parseErrorMessage(error) },
      { status: 500 },
    );
  }
}
