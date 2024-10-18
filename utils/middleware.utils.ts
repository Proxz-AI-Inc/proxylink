import { AUTH_COOKIE_NAME } from '@/constants/app.contants';
import { NextRequest, NextResponse } from 'next/server';

export const AUTH_COOKIE_EXPIRES_IN = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds

export function isReturningFromStripeCheckout(request: NextRequest): boolean {
  return request.nextUrl.searchParams.has('session_id');
}

export async function handleStripeCheckoutReturn(
  request: NextRequest,
): Promise<NextResponse> {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe credentials are not set');
    }

    const sessionId = request.nextUrl.searchParams.get('session_id');
    const firebaseSession =
      request.nextUrl.searchParams.get('firebase_session');

    if (!sessionId || !firebaseSession) {
      throw new Error(
        'Missing session id or firebase session in Stripe checkout return',
      );
    }

    const verifyResponse = await fetch(
      new URL('/api/verify-session', request.url).toString(),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session: firebaseSession }),
      },
    );

    if (verifyResponse.ok) {
      console.log('handleStripeCheckoutReturn: session is verified');
      const response = NextResponse.next();
      setAuthCookie(response, firebaseSession);
      console.log('Auth cookie set, continuing to the requested page');
      return response;
    } else {
      console.log('handleStripeCheckoutReturn: session is not verified');
      throw new Error('Failed to verify session');
    }
  } catch (error) {
    console.error('Invalid session from Stripe:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export function setAuthCookie(response: NextResponse, sessionCookie: string) {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: sessionCookie,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: AUTH_COOKIE_EXPIRES_IN / 1000, // Convert to seconds
    path: '/',
  });
}
