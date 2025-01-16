import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { parseErrorMessage } from '@/utils/general';
import { TenantType } from '@/lib/db/schema';
import * as logger from '@/lib/logger/logger';

/**
 * Handles DELETE requests to remove an invitation.
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} A response indicating success or failure.
 */
type Params = Promise<{ id: string }>;
export async function DELETE(
  req: NextRequest,
  segmentData: { params: Params },
): Promise<NextResponse> {
  initializeFirebaseAdmin();
  const params = await segmentData.params;
  const email = req.headers.get('x-user-email') ?? 'anonymous';
  const tenantId = req.headers.get('x-tenant-id') ?? 'unknown';
  const tenantType = req.headers.get('x-tenant-type') as TenantType;

  if (!params.id) {
    logger.error('Missing invitation ID', {
      email,
      tenantId,
      tenantType,
      method: 'DELETE',
      route: '/api/invitations/[id]',
      statusCode: 400,
    });
    return new NextResponse(
      JSON.stringify({ error: 'Missing invitation ID' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  const db: Firestore = getFirestore();
  const invitationRef = db.collection('invitations').doc(params.id);

  try {
    await invitationRef.delete();

    logger.info('Invitation deleted successfully', {
      email,
      tenantId,
      tenantType,
      method: 'DELETE',
      route: '/api/invitations/[id]',
      statusCode: 200,
    });

    return new NextResponse(
      JSON.stringify({ message: 'Invitation deleted successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    logger.error('Error deleting invitation', {
      email,
      tenantId,
      tenantType,
      method: 'DELETE',
      route: '/api/invitations/[id]',
      statusCode: 500,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    });
    console.log('Error deleting invitation', error);
    return new NextResponse(
      JSON.stringify({
        error: 'Error deleting invitation: ' + parseErrorMessage(error),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
