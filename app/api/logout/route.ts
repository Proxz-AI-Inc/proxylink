// app/api/logout/route.ts
import { NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { verificationCache } from '@/middleware';
import { AUTH_COOKIE_NAME } from '@/constants/app.contants';
import * as logger from '@/lib/logger/logger';

export async function POST() {
  try {
    initializeFirebaseAdmin();
    const auth = getAuth();
    const sessionCookie = cookies().get(AUTH_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      logger.error('Logout attempt without session cookie', {
        tenantId: 'system',
        email: 'anonymous',
        method: 'POST',
        route: '/api/logout',
        statusCode: 400,
      });
      return NextResponse.json({ error: 'No session cookie' }, { status: 400 });
    }

    const decodedClaims = await auth.verifySessionCookie(sessionCookie, false);

    if (!decodedClaims.email) {
      throw new Error('User email not found in session claims');
    }

    await auth.revokeRefreshTokens(decodedClaims.sub);
    verificationCache.delete(sessionCookie);

    logger.info('User logged out', {
      tenantId: decodedClaims.tenantId || 'system',
      email: decodedClaims.email,
      tenantType: decodedClaims.tenantType,
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
      tenantId: 'system',
      email: 'anonymous',
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
