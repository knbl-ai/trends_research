import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const isAuthPage = pathname.startsWith('/auth/login');
  const isApiAuthRoute = pathname.startsWith('/api/auth');
  const isPublicAsset = pathname.startsWith('/_next') ||
                        pathname.startsWith('/favicon.ico') ||
                        pathname.match(/\.(svg|png|jpg|jpeg|gif|webp)$/);

  // Allow public paths
  if (isAuthPage || isApiAuthRoute || isPublicAsset) {
    return NextResponse.next();
  }

  // Check if user has session cookie (basic check for Edge runtime)
  const sessionCookie = request.cookies.get('authjs.session-token') ||
                        request.cookies.get('__Secure-authjs.session-token');

  // If no session cookie and not on auth page, redirect to login
  if (!sessionCookie) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If has session cookie and trying to access login page, redirect to home
  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
