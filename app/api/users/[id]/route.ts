// file: app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { parseErrorMessage } from '@/utils/general';
import { TenantType } from '@/lib/db/schema';
import * as logger from '@/lib/logger/logger';

/**
 * Handles PATCH requests to update user information.
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} A response indicating success or failure.
 */
type Params = Promise<{ id: string }>;
export async function PATCH(
  req: NextRequest,
  segmentData: { params: Params },
): Promise<NextResponse> {
  initializeFirebaseAdmin();
  const updatedData = await req.json();

  const params = await segmentData.params;
  const email = req.headers.get('x-user-email') ?? 'anonymous';
  const tenantId = req.headers.get('x-tenant-id') ?? 'unknown';
  const tenantType = req.headers.get('x-tenant-type') as TenantType;

  if (!params.id) {
    logger.error('Missing user ID', {
      email,
      tenantId,
      tenantType,
      method: 'PATCH',
      route: '/api/users/[id]',
      statusCode: 400,
    });
    return new NextResponse(
      JSON.stringify({ error: 'Missing user information' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  const db: Firestore = getFirestore();
  const userRef = db.collection('users').doc(params.id);

  try {
    await userRef.update(updatedData);

    logger.info('User updated successfully', {
      email,
      tenantId,
      tenantType,
      method: 'PATCH',
      route: '/api/users/[id]',
      statusCode: 200,
    });

    return new NextResponse(JSON.stringify({ message: 'User updated' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('Error updating user', {
      email,
      tenantId,
      tenantType,
      method: 'PATCH',
      route: '/api/users/[id]',
      statusCode: 500,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    });
    console.log('Error updating user', error);
    return new NextResponse(
      JSON.stringify({
        error: 'Error updating user data: ' + parseErrorMessage(error),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
