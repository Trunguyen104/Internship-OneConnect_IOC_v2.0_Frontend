import { NextResponse } from 'next/server';

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Normalize legacy /Uploads/* to /uploads/* (case mismatches from BE/static links).
  if (pathname.startsWith('/Uploads/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/Uploads\//, '/uploads/');
    return NextResponse.rewrite(url);
  }

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
    '/Uploads/:path*',
  ],
};
