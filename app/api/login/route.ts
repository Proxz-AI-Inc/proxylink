// file: app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { getAuth } from 'firebase-admin/auth';
import {
  AUTH_COOKIE_EXPIRES_IN,
  setAuthCookie,
} from '@/utils/middleware.utils';
import * as logger from '@/lib/logger/logger';
import { TenantType } from '@/lib/db/schema';

/**
 * Handles POST requests for user authentication and session creation.
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} A response containing the authentication status or an error message.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const email = request.headers.get('x-user-email') ?? 'anonymous';
  const tenantId = request.headers.get('x-tenant-id') ?? 'system';
  const tenantType =
    (request.headers.get('x-tenant-type') as TenantType) ?? 'management';

  try {
    const { idToken } = await request.json();

    if (!idToken) {
      logger.error('Login attempt without ID token', {
        email,
        tenantId,
        tenantType,
        method: 'POST',
        route: '/api/login',
        statusCode: 400,
      });
      return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
    }

    initializeFirebaseAdmin();
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(idToken);

    if (!decodedToken.email) {
      logger.error('User email not found in token', {
        email,
        tenantId,
        tenantType,
        method: 'POST',
        route: '/api/login',
        statusCode: 401,
      });
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 401 },
      );
    }

    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: AUTH_COOKIE_EXPIRES_IN,
    });

    console.log('User logged in successfully', sessionCookie);

    logger.info('User logged in successfully', {
      email: decodedToken.email,
      tenantId: decodedToken.tenantId || tenantId,
      tenantType: decodedToken.tenantType || tenantType,
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
    console.error('Authentication failed', error);
    logger.error('Authentication failed', {
      email,
      tenantId,
      tenantType,
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
