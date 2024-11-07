import { NextResponse } from 'next/server';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { TenantType } from '@/lib/db/schema';
import * as logger from '@/lib/logger/logger';
export async function GET(req: Request): Promise<NextResponse> {
  initializeFirebaseAdmin();
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get('tenantId');
  const email = req.headers.get('x-user-email') ?? 'anonymous';
  const tenantType = req.headers.get('x-tenant-type') as TenantType;

  if (!tenantId) {
    logger.error('Missing tenant ID', {
      email,
      tenantId: 'unknown',
      tenantType: tenantType,
      method: 'GET',
      route: '/api/users',
      statusCode: 400,
    });
    return new NextResponse(
      JSON.stringify({ error: 'Tenant ID is required' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  const db: Firestore = getFirestore();
  const usersRef = db.collection('users').where('tenantId', '==', tenantId);

  try {
    const snapshot = await usersRef.get();
    const users = snapshot.docs.map(doc => doc.data());

    return new NextResponse(JSON.stringify(users), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    logger.error('Failed to fetch users', {
      email,
      tenantId,
      tenantType,
      method: 'GET',
      route: '/api/users',
      statusCode: 500,
    });
    return new NextResponse(JSON.stringify({ error: 'Error fetching users' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
