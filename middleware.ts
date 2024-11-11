import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/constants/app.contants';

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

const CACHE_TTL = 5 * 60 * 1000; // 5 минут

// Public API endpoints that don't require authentication
const PUBLIC_API_ROUTES = [
  '/api/login',
  '/api/verify-session',
  '/api/stripe',
  '/api/checkout',
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
  '/checkout_success',
  '/sentry-example-page',
];

// Static resources that should always be accessible
const STATIC_RESOURCES = ['/_next', '/favicon.ico', '/images'];

export const config = {
  matcher: [
    // Protected API routes
    '/api/:path*',

    // Protected app routes
    '/((?!_next/static|_next/image|favicon.ico|images|login|signup|reset-password|schedule-demo|article|careers|sentry-example-page|pricing|checkout_success|api/login|api/verify-session|api/stripe|api/checkout|$).*)',
  ],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes and resources
  const isPublicRoute = (path: string, routes: string[]) =>
    routes.some(route => path.startsWith(route));

  if (
    isPublicRoute(pathname, PUBLIC_API_ROUTES) ||
    isPublicRoute(pathname, PUBLIC_PAGES) ||
    isPublicRoute(pathname, STATIC_RESOURCES)
  ) {
    return NextResponse.next();
  }

  try {
    if (pathname === '/api/verify-session') {
      return NextResponse.next();
    }

    const session = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Проверяем кэш
    const cached = verificationCache.get(session);
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_TTL) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-email', cached.data.email);
      requestHeaders.set('x-tenant-id', cached.data.tenantId);
      requestHeaders.set('x-tenant-type', cached.data.tenantType);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

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

      // Сохраняем в кэш
      verificationCache.set(session, {
        timestamp: now,
        data: data.user,
      });

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

    return NextResponse.redirect(new URL('/login', request.url));
  } catch (error) {
    console.error('Error in middleware:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Добавляем экспорт функции очистки кэша
export function clearSessionCache(session: string) {
  verificationCache.delete(session);
}
