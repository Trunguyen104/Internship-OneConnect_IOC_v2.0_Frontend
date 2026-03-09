import { NextResponse } from 'next/server';

export function proxy(request) {
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const pathname = request.nextUrl.pathname;

  if (pathname === '/login' && refreshToken) {
    return NextResponse.redirect(new URL('/student/space', request.url));
  }

  // if (pathname.startsWith('/student') && !refreshToken) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/login'],
};
