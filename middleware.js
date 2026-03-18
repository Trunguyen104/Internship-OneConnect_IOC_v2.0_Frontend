import { NextResponse } from 'next/server';

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Cookie-based auth (HttpOnly). Treat having a refresh token as "logged in".
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isProtected =
    pathname.startsWith('/internship-groups') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/admin-users');

  if (isProtected && !refreshToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/internship-groups/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/admin-users/:path*',
  ],
};

