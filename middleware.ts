import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/constants/app.contants';

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
];

// Static assets that should always be accessible
const STATIC_RESOURCES = ['/_next', '/favicon.ico', '/images'];

// Next.js middleware configuration
// Defines which routes should be processed by this middleware
export const config = {
  matcher: [
    // Protect all API routes except those in PUBLIC_API_ROUTES
    '/api/:path*',

    // Complex matcher to protect all routes except public ones
    // Uses negative lookahead to exclude public routes and static resources
    '/((?!_next/static|_next/image|favicon.ico|images|login|signup|reset-password|schedule-demo|article|careers|pricing|api/login|api/verify-session|api/stripe|api/checkout|$).*)',
  ],
};

export async function middleware(request: NextRequest) {
  // Add request source tracking
  const { pathname } = request.nextUrl;
  const referer = request.headers.get('referer');
  const xRequestedWith = request.headers.get('x-requested-with');

  console.log(
    `[Middleware] Path: ${pathname}, Referer: ${referer}, RequestedWith: ${xRequestedWith}`,
  );

  // Helper function to check if a path starts with any of the given routes
  const isPublicRoute = (path: string, routes: string[]) =>
    routes.some(route => path.startsWith(route));

  // Allow access to public routes without authentication
  if (
    isPublicRoute(pathname, PUBLIC_API_ROUTES) ||
    isPublicRoute(pathname, PUBLIC_PAGES) ||
    isPublicRoute(pathname, STATIC_RESOURCES)
  ) {
    return NextResponse.next();
  }

  try {
    // Special case: allow verify-session endpoint to prevent infinite loops
    if (pathname === '/api/verify-session') {
      return NextResponse.next();
    }

    // Check for authentication cookie
    const session = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!session) {
      // Redirect to login if no session cookie found
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check cache for existing session verification
    const cached = verificationCache.get(session);
    const now = Date.now();

    // When checking cache
    if (cached && now - cached.timestamp < CACHE_TTL) {
      console.log('[Middleware] Cache HIT');
    } else {
      console.log('[Middleware] Cache MISS');
    }

    // If cache hit and not expired, use cached data
    if (cached && now - cached.timestamp < CACHE_TTL) {
      console.log('[Middleware] Cache HIT');

      const requestHeaders = new Headers(request.headers);
      // Add user context to headers for downstream use
      requestHeaders.set('x-user-email', cached.data.email);
      requestHeaders.set('x-tenant-id', cached.data.tenantId);
      requestHeaders.set('x-tenant-type', cached.data.tenantType);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } else {
      console.log('[Middleware] Cache MISS');
    }

    // Verify session with backend if not in cache or expired
    const verifyResponse = await fetch(
      new URL('/api/verify-session', request.nextUrl.origin),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ session }),
      },
    );

    if (verifyResponse.ok) {
      const data = await verifyResponse.json();

      // Update cache with fresh session data
      verificationCache.set(session, {
        timestamp: now,
        data: data.user,
      });

      // Add user context to headers for downstream use
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-email', data.user.email);
      requestHeaders.set('x-tenant-id', data.user.tenantId);
      requestHeaders.set('x-tenant-type', data.user.tenantType);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    // Redirect to login if session verification fails
    return NextResponse.redirect(new URL('/login', request.url));
  } catch (error) {
    console.error('Error in middleware:', error);
    // Redirect to login on any errors for security
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Utility function to manually clear session from cache
// Useful for logout or session invalidation
export function clearSessionCache(session: string) {
  verificationCache.delete(session);
}
