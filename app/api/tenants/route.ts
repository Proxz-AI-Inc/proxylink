// file: app/api/tenants/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import * as logger from '@/lib/logger/logger';
import { TenantType } from '@/lib/db/schema';
/**
 * Handles GET requests to fetch all tenants.
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} A response containing the fetched tenants or an error message.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  initializeFirebaseAdmin();
  const db: Firestore = getFirestore();
  const tenantsRef = db.collection('tenants');
  const email = req.headers.get('x-user-email') ?? 'anonymous';
  const tenantId = req.headers.get('x-tenant-id') ?? 'unknown';
  const tenantType = req.headers.get('x-tenant-type') as TenantType;

  try {
    const { searchParams } = new URL(req.url);
    let query = tenantsRef.where('type', '!=', 'management');

    for (const [key, value] of searchParams.entries()) {
      if (key !== 'minimal') {
        query = query.where(key, '==', value);
      }
    }

    const snapshot = await query.get();
    let tenants;

    if (searchParams.get('minimal') === 'true') {
      tenants = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      }));
    } else {
      tenants = snapshot.docs;
    }

    return NextResponse.json(tenants, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error fetching tenants:', error);
    logger.error('Error fetching tenants', {
      method: 'GET',
      route: '/api/tenants',
      statusCode: 500,
      email,
      tenantId,
      tenantType,
    });
    return NextResponse.json(
      { error: 'Error fetching tenants' },
      { status: 500 },
    );
  }
}
