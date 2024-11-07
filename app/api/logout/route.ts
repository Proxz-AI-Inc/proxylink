// app/api/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/constants/app.contants';
import * as logger from '@/lib/logger/logger';
import { TenantType } from '@/lib/db/schema';

/**
 * Handles POST requests for user logout and session termination.
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} A response indicating logout success or failure.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const email = request.headers.get('x-user-email') ?? 'anonymous';
  const tenantId = request.headers.get('x-tenant-id') ?? 'system';
  const tenantType = request.headers.get('x-tenant-type') as TenantType;

  try {
    initializeFirebaseAdmin();
    const auth = getAuth();
    const sessionCookie = cookies().get(AUTH_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      logger.error('Logout attempt without session cookie', {
        email,
        tenantId,
        tenantType,
        method: 'POST',
        route: '/api/logout',
        statusCode: 400,
      });
      return NextResponse.json({ error: 'No session cookie' }, { status: 400 });
    }

    const decodedClaims = await auth.verifySessionCookie(sessionCookie, false);

    if (!decodedClaims.email) {
      logger.error('User email not found in session claims', {
        email,
        tenantId,
        tenantType,
        method: 'POST',
        route: '/api/logout',
        statusCode: 401,
      });
      return NextResponse.json(
        { error: 'Invalid session format' },
        { status: 401 },
      );
    }

    await auth.revokeRefreshTokens(decodedClaims.sub);

    logger.info('User logged out successfully', {
      email: decodedClaims.email,
      tenantId: decodedClaims.tenantId || tenantId,
      tenantType: decodedClaims.tenantType || tenantType,
      method: 'POST',
      route: '/api/logout',
      statusCode: 200,
    });

    const response = NextResponse.json({ status: 'success' }, { status: 200 });
    response.cookies.set(AUTH_COOKIE_NAME, '', {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return response;
  } catch (error) {
    logger.error('Logout failed', {
      email,
      tenantId,
      tenantType,
      method: 'POST',
      route: '/api/logout',
      statusCode: 500,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    });

    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
