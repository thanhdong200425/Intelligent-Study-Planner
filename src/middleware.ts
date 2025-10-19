import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that doesn't require authentication
const publicRoutes = ['/auth', '/verify'];

// API routes that doesn't require authentication
const publicApiRoutes = ['/api/auth'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  const isPublicApiRoute = publicApiRoutes.some(route =>
    pathname.startsWith(route)
  );

  const sessionCookie = request.cookies.get('sid');

  if (isPublicRoute || isPublicApiRoute) {
    // Check if session is exist or not, it session exist, redirect to home page
    if (sessionCookie && sessionCookie.value) {
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
    return NextResponse.next();
  }

  // If no session cookie, redirect to auth page
  if (!sessionCookie || !sessionCookie.value) {
    const authUrl = new URL('/auth', request.url);
    authUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(authUrl);
  }
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
