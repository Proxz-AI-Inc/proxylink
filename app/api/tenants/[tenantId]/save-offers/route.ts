// file: app/api/tenants/[id]/save-offers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, Firestore, FieldValue } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { SaveOffer, Tenant } from '@/lib/db/schema';
import * as logger from '@/lib/logger/logger';

/**
 * Handles the POST request to create a new save offer for a tenant.
 *
 * @param {NextRequest} request - The incoming request object.
 * @param {string} params.tenantId - The ID of the tenant.
 * @returns {Promise<NextResponse>} - The response object.
 */
type Params = Promise<{ tenantId: string }>;
export async function POST(
  request: NextRequest,
  segmentData: { params: Params },
) {
  initializeFirebaseAdmin();
  const params = await segmentData.params;
  const email = request.headers.get('x-user-email') ?? 'anonymous';
  const tenantType = 'provider';

  if (!params.tenantId) {
    logger.error('Invalid tenant ID', {
      email,
      tenantId: params.tenantId,
      tenantType,
      method: 'POST',
      route: '/api/tenants/[tenantId]/save-offers',
      statusCode: 400,
    });
    return NextResponse.json({ message: 'Invalid tenant ID' }, { status: 400 });
  }

  const db: Firestore = getFirestore();
  const tenantRef = db.collection('tenants').doc(params.tenantId);

  try {
    const newOffer: Partial<SaveOffer> = await request.json();

    if (!newOffer.title || !newOffer.description) {
      logger.error(
        `Missing required save offer fields, title - ${newOffer.title} and description - ${newOffer.description} are required`,
        {
          email,
          tenantId: params.tenantId,
          tenantType,
          method: 'POST',
          route: '/api/tenants/[tenantId]/save-offers',
          statusCode: 400,
        },
      );
      return NextResponse.json(
        { message: 'Title and description are required' },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();
    const saveOffer: SaveOffer = {
      id: db.collection('tenants').doc().id,
      dateCreated: now,
      dateUpdated: null,
      title: newOffer.title,
      description: newOffer.description,
    };

    await tenantRef.update({
      saveOffers: FieldValue.arrayUnion(saveOffer),
    });

    const updatedTenantDoc = await tenantRef.get();
    const updatedTenant = updatedTenantDoc.data() as Tenant;

    logger.info('Save offer created successfully', {
      email,
      tenantId: params.tenantId,
      tenantType,
      method: 'POST',
      route: '/api/tenants/[tenantId]/save-offers',
      statusCode: 201,
    });

    return NextResponse.json(
      {
        message: `Save offer "${newOffer.title}" added successfully`,
        saveOffers: updatedTenant.saveOffers,
      },
      { status: 201 },
    );
  } catch (error) {
    logger.error('Error creating save offer', {
      email,
      tenantId: params.tenantId,
      tenantType,
      method: 'POST',
      route: '/api/tenants/[tenantId]/save-offers',
      statusCode: 500,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    });
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
