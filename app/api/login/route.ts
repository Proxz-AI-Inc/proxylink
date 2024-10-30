// file: app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { getAuth } from 'firebase-admin/auth';
import {
  AUTH_COOKIE_EXPIRES_IN,
  setAuthCookie,
} from '@/utils/middleware.utils';
import * as logger from '@/lib/logger/logger';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { idToken } = body;

  if (!idToken) {
    logger.error('Login attempt without ID token', {
      tenantId: 'system',
      email: 'anonymous',
      method: 'POST',
      route: '/api/login',
      statusCode: 400,
    });
    return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
  }

  try {
    initializeFirebaseAdmin();
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(idToken);

    if (!decodedToken.email) {
      throw new Error('User email not found in token');
    }

    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: AUTH_COOKIE_EXPIRES_IN,
    });

    logger.info('User logged in', {
      tenantId: decodedToken.tenantId,
      email: decodedToken.email,
      tenantType: decodedToken.tenantType,
      method: 'POST',
      route: '/api/login',
      statusCode: 200,
    });

    const responsePayload = {
      status: 'success',
      tenantType: decodedToken.tenantType,
    };

    const response = NextResponse.json(responsePayload, { status: 200 });
    setAuthCookie(response, sessionCookie);

    return response;
  } catch (error) {
    logger.error('Authentication failed', {
      tenantId: 'system',
      email: 'anonymous',
      method: 'POST',
      route: '/api/login',
      statusCode: 401,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    });

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
