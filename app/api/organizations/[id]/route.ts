import { parseErrorMessage } from '@/utils/general';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import * as logger from '@/lib/logger/logger';
import { TenantType } from '@/lib/db/schema';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/constants/app.contants';

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> => {
  const db: Firestore = getFirestore();
  const auth = getAuth();
  const { id } = params;
  const sessionCookie = cookies().get(AUTH_COOKIE_NAME)?.value;
  if (!sessionCookie) {
    logger.error('DELETE org attempt without session cookie', {
      tenantId: 'system',
      email: 'anonymous',
      method: 'DELETE',
      route: '/api/organizations/[id]',
      statusCode: 400,
    });
    return NextResponse.json({ error: 'No session cookie' }, { status: 400 });
  }

  const decodedClaims = await auth.verifySessionCookie(sessionCookie, false);

  try {
    // Delete users associated with the tenant
    const usersSnapshot = await db
      .collection('users')
      .where('tenantId', '==', id)
      .get();

    const deletePromises = usersSnapshot.docs.map(async doc => {
      const userId = doc.id;
      await auth.deleteUser(userId);
      await doc.ref.delete();
    });

    await Promise.all(deletePromises);

    // Delete the tenant
    await db.collection('tenants').doc(id).delete();

    logger.info('Organization and users deleted successfully', {
      email: decodedClaims.email || 'anonymous',
      tenantId: decodedClaims.tenantId || 'unknown',
      tenantType: decodedClaims.tenantType as TenantType,
      method: 'DELETE',
      route: '/api/organizations/[id]',
      statusCode: 200,
    });

    return NextResponse.json({
      message: 'Organization and all associated users deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting organization', {
      email: decodedClaims.email || 'anonymous',
      tenantId: decodedClaims.tenantId || 'unknown',
      tenantType: decodedClaims.tenantType as TenantType,
      method: 'DELETE',
      route: '/api/organizations/[id]',
      statusCode: 500,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    });

    console.error('DELETE /organizations/:id', parseErrorMessage(error));
    return NextResponse.json(
      {
        message: parseErrorMessage(error),
      },
      { status: 500 },
    );
  }
};
