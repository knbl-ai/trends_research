import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Force Node.js runtime instead of Edge runtime to support MongoDB
export const runtime = 'nodejs';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Public paths that don't require authentication
  const isAuthPage = pathname.startsWith('/auth/login');
  const isApiAuthRoute = pathname.startsWith('/api/auth');

  // If user is logged in and trying to access login page, redirect to home
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // If user is not logged in and trying to access protected pages, redirect to login
  if (!isLoggedIn && !isAuthPage && !isApiAuthRoute) {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

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
