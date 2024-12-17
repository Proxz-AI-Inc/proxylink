import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/constants/app.contants';
import { User } from '@/lib/db/schema';

// Cache to store verified session data to reduce API calls
// Key: session token, Value: user data with timestamp
const verificationCache = new Map<
  string,
  {
    timestamp: number;
    data: {
      email: string;
      tenantId: string;
      tenantType: string;
    };
  }
>();

// Cache duration: 5 minutes in milliseconds
const CACHE_TTL = 5 * 60 * 1000;

// Routes that bypass authentication checks
const PUBLIC_API_ROUTES = [
  '/api/login',
  '/api/verify-session', // Session verification endpoint
  '/api/stripe', // Stripe webhook handling
  '/api/checkout', // Payment processing
  '/api/contact', // Contact form endpoint
];

// Public pages that don't require authentication
const PUBLIC_PAGES = [
  '/login',
  '/signup',
  '/reset-password',
  '/schedule-demo',
  '/article',
  '/careers',
  '/pricing',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
  '/register',
];

// Static assets that should always be accessible
const STATIC_RESOURCES = ['/_next', '/favicon', '/favicon.ico', '/images'];

// Next.js middleware configuration
// Defines which routes should be processed by this middleware
export const config = {
  matcher: [
    // Protect all API routes except those in PUBLIC_API_ROUTES
    '/api/:path*',

    // Complex matcher to protect all routes except public ones
    // Uses negative lookahead to exclude public routes and static resources
    '/((?!_next/static|_next/image|favicon.ico|images|login|signup|reset-password|schedule-demo|article|careers|pricing|register|api/login|api/verify-session|api/stripe|api/checkout|$).*)',
  ],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Helper function to check if a path starts with any of the given routes
  const isPublicRoute = (path: string, routes: string[]) =>
    routes.some(route => path.startsWith(route));

  // Add root path to public routes if it's not already there
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Explicitly check and handle public routes first
  const isPublic =
    isPublicRoute(pathname, PUBLIC_API_ROUTES) ||
    isPublicRoute(pathname, PUBLIC_PAGES) ||
    isPublicRoute(pathname, STATIC_RESOURCES);

  if (isPublic) {
    return NextResponse.next();
  }

  // Handle session verification
  const session = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Skip verification for already verified sessions
  const cached = verificationCache.get(session);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return addUserContextAndProceed(request, cached.data as User);
  }

  try {
    const verifyResponse = await fetch(
      new URL('/api/verify-session', request.nextUrl.origin),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session }),
      },
    );

    if (!verifyResponse.ok) {
      // Clear the revoked session
      verificationCache.delete(session);

      // Clear the auth cookie
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete(AUTH_COOKIE_NAME);

      return response;
    }

    const data = await verifyResponse.json();
    verificationCache.set(session, {
      timestamp: Date.now(),
      data: data.user,
    });

    return addUserContextAndProceed(request, data.user);
  } catch (error) {
    // Clear both cache and cookie on error
    verificationCache.delete(session);
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete(AUTH_COOKIE_NAME);

    return response;
  }
}

// Helper function to add user context and proceed
function addUserContextAndProceed(request: NextRequest, userData: User) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-email', userData.email);
  requestHeaders.set('x-tenant-id', userData.tenantId);
  requestHeaders.set('x-tenant-type', userData.tenantType);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Utility function to manually clear session from cache
// Useful for logout or session invalidation
export function clearSessionCache(session: string) {
  verificationCache.delete(session);
}
