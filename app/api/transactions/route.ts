import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { TenantType } from '@/lib/db/schema';
import * as logger from '@/lib/logger/logger';

/**
 * Handles GET requests to fetch transactions for a tenant.
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} A response containing the fetched transactions or an error message.
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const tenantId = searchParams.get('tenantId');
  const email = req.headers.get('x-user-email') ?? 'anonymous';
  const tenantType = req.headers.get('x-tenant-type') as TenantType;

  if (!tenantId) {
    logger.error('Missing tenant ID', {
      email,
      tenantId: 'unknown',
      tenantType,
      method: 'GET',
      route: '/api/transactions',
      statusCode: 400,
    });
    return NextResponse.json(
      { error: 'Tenant ID is required' },
      { status: 400 },
    );
  }

  try {
    initializeFirebaseAdmin();
    const db = getFirestore();

    const transactionsRef = db
      .collection('tenants')
      .doc(tenantId)
      .collection('transactions');

    const querySnapshot = await transactionsRef
      .orderBy('createdAt', 'desc')
      .get();

    const transactions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ transactions });
  } catch (error) {
    logger.error('Failed to fetch transactions', {
      email,
      tenantId,
      tenantType,
      method: 'GET',
      route: '/api/transactions',
      statusCode: 500,
    });
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 },
    );
  }
}
