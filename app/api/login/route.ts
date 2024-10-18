// file: app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { getAuth } from 'firebase-admin/auth';
import {
  AUTH_COOKIE_EXPIRES_IN,
  setAuthCookie,
} from '@/utils/middleware.utils';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { idToken } = body;

  if (!idToken) {
    return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
  }

  try {
    initializeFirebaseAdmin();
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(idToken);
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: AUTH_COOKIE_EXPIRES_IN,
    });

    // Get user claims
    const userClaims = decodedToken;

    // Extract tenantType from claims
    const tenantType = userClaims.tenantType;

    // Create response based on tenantType
    const responsePayload = {
      status: 'success',
      tenantType,
    };

    const response = NextResponse.json(responsePayload, { status: 200 });
    setAuthCookie(response, sessionCookie);

    return response;
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
