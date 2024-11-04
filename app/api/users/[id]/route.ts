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
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  initializeFirebaseAdmin();
  const updatedData = await req.json();
  console.log('Updating user', updatedData, req.user);
  const { id } = params;

  if (!id) {
    logger.error('Missing user ID', {
      email: req.user?.email || 'anonymous',
      tenantId: req.user?.tenantId || 'unknown',
      tenantType: req.user?.tenantType as TenantType,
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
  const userRef = db.collection('users').doc(id);

  try {
    await userRef.update(updatedData);

    logger.info('User updated successfully', {
      email: req.user?.email || 'anonymous',
      tenantId: req.user?.tenantId || 'unknown',
      tenantType: req.user?.tenantType as TenantType,
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
      email: req.user?.email || 'anonymous',
      tenantId: req.user?.tenantId || 'unknown',
      tenantType: req.user?.tenantType as TenantType,
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
