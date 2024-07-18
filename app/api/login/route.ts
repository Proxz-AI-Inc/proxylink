// file: app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { getAuth } from 'firebase-admin/auth';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { idToken } = body;

  if (!idToken) {
    return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
  }

  try {
    initializeFirebaseAdmin();
    const auth = getAuth();

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn,
    });

    const response = NextResponse.json({ status: 'success' }, { status: 200 });
    response.cookies.set({
      name: 'session',
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: expiresIn / 1000,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
