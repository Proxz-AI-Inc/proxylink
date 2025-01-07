import { NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { TenantType } from '@/lib/db/schema';
import * as logger from '@/lib/logger/logger';
import { getAuth } from 'firebase-admin/auth';

export async function GET(req: Request): Promise<NextResponse> {
  initializeFirebaseAdmin();
  const { searchParams } = new URL(req.url);
  const checkEmail = searchParams.get('email');
  const email = req.headers.get('x-user-email') ?? 'anonymous';
  const tenantType = req.headers.get('x-tenant-type') as TenantType;

  if (!checkEmail) {
    logger.error('Missing email parameter', {
      email,
      tenantId: 'unknown',
      tenantType,
      method: 'GET',
      route: '/api/users',
      statusCode: 400,
    });
    return NextResponse.json(
      { error: 'Email parameter is required' },
      { status: 400 },
    );
  }

  try {
    const auth = getAuth();
    const userExists = await auth
      .getUserByEmail(checkEmail)
      .then(() => true)
      .catch((error: { code?: string }) => {
        if (error.code === 'auth/user-not-found') {
          return false;
        }
        throw error;
      });

    logger.info('Checked user existence', {
      email,
      tenantId: 'unknown',
      tenantType,
      method: 'GET',
      route: '/api/users',
      statusCode: 200,
    });

    return NextResponse.json({ exists: userExists }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to check user existence', {
      email,
      tenantId: 'unknown',
      tenantType,
      method: 'GET',
      route: '/api/users',
      statusCode: 500,
      error: {
        message: errorMessage,
      },
    });
    return NextResponse.json(
      { error: 'Failed to check user existence' },
      { status: 500 },
    );
  }
}
