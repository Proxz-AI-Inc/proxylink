import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { getAuth } from 'firebase-admin/auth';
import { validatePassword } from '@/utils/passwordValidation';
import * as logger from '@/lib/logger/logger';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/constants/app.contants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Validate new password
    const { isValid, errors } = validatePassword(newPassword);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password', details: errors },
        { status: 400 },
      );
    }

    // Initialize Firebase Admin and get session
    initializeFirebaseAdmin();
    const auth = getAuth();
    const sessionCookie = cookies().get(AUTH_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      logger.error('Password change attempt without session cookie', {
        tenantId: 'system',
        email: 'anonymous',
        method: 'POST',
        route: '/api/change-password',
        statusCode: 401,
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify session and get user
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userRecord = await auth.getUser(decodedClaims.sub);

    if (!userRecord.email) {
      throw new Error('User email not found');
    }

    // Update password
    await auth.updateUser(decodedClaims.sub, {
      password: newPassword,
    });

    // Revoke all existing sessions for security
    await auth.revokeRefreshTokens(decodedClaims.sub);

    logger.info('Password changed successfully', {
      tenantId: decodedClaims.tenantId || 'system',
      email: userRecord.email,
      method: 'POST',
      route: '/api/change-password',
      statusCode: 200,
    });

    return NextResponse.json(
      { status: 'success', message: 'Password updated successfully' },
      { status: 200 },
    );
  } catch (error) {
    logger.error('Password change failed', {
      tenantId: 'system',
      email: 'anonymous',
      method: 'POST',
      route: '/api/change-password',
      statusCode: 500,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    });

    return NextResponse.json(
      { error: 'Password change failed' },
      { status: 500 },
    );
  }
}
