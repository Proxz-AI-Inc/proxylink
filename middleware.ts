import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/constants/app.contants';
import {
  isReturningFromStripeCheckout,
  handleStripeCheckoutReturn,
} from './utils/middleware.utils';

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login|signup|reset-password|favicon|images|schedule-demo|article|careers|sentry-example-page|pricing|checkout_success|$).*)',
  ],
};

// Simple in-memory cache
export const verificationCache = new Map<string, number>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function sanitizeUrl(url: string): string {
  try {
    const sanitized = new URL(url);
    return sanitized.origin;
  } catch (error) {
    console.error('Invalid URL in middleware:', error);
    throw new Error('Invalid URL provided in middleware');
  }
}

export async function middleware(request: NextRequest) {
  try {
    if (isReturningFromStripeCheckout(request)) {
      console.log(
        'Returning from Stripe checkout, calling handleStripeCheckoutReturn',
      );
      const response = await handleStripeCheckoutReturn(request);
      return response;
    }

    const session = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const now = Date.now();
    const cachedTime = verificationCache.get(session);

    // If the session is in cache and not expired, allow the request
    if (cachedTime && now - cachedTime < CACHE_DURATION) {
      return NextResponse.next();
    }

    const baseUrl = sanitizeUrl(request.url);
    const verifyResponse = await fetch(`${baseUrl}/api/verify-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session }),
    });

    if (verifyResponse.ok) {
      const data = await verifyResponse.json();

      const response = NextResponse.next();
      response.headers.set('x-user-email', data.user.email);
      response.headers.set('x-tenant-id', data.user.tenantId);
      response.headers.set('x-tenant-type', data.user.tenantType);

      return response;
    }

    console.error(
      'Session verification failed in middleware, redirecting to login...',
    );

    return NextResponse.redirect(new URL('/login', request.url));
  } catch (error) {
    console.error('Error in middleware:', error);
    console.log('middleware: redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
