import { NextResponse } from 'next/server';

import { AUTH_COOKIE_ACCESS, AUTH_COOKIE_REFRESH } from './src/lib/auth/cookie-names.js';
import { PUBLIC_ROUTE_PATHS } from './src/lib/auth/public-routes.js';

/**
 * Routes that DO NOT require authentication.
 * Any route NOT in this list will be protected by default.
 */

/**
 * ASSET_PREFIXES: Routes used for static files or public assets.
 */
const ASSET_PREFIXES = ['/uploads/', '/assets/', '/static/'];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Performance optimization: skip middleware for internal Next.js requests and prefetches
  // (Note: The matcher in 'config' handles most of this, but we keep it here for defense-in-depth)

  // 2. Normalize legacy /Uploads/* to /uploads/*
  if (pathname.startsWith('/Uploads/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/Uploads\//, '/uploads/');
    return NextResponse.rewrite(url);
  }

  // 3. Identification: Extract auth token from HttpOnly cookies
  const refreshToken = request.cookies.get(AUTH_COOKIE_REFRESH)?.value;
  const accessToken = request.cookies.get(AUTH_COOKIE_ACCESS)?.value;

  // 4. Determine if the current route is PUBLIC or an ASSET
  const isPublicRoute = PUBLIC_ROUTE_PATHS.includes(pathname);
  const isAsset = ASSET_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  // 5. PROTECTION LOGIC (Deny by Default)
  // If it's not public, not an asset, and no token exists -> Redirect to login
  if (!isPublicRoute && !isAsset && !refreshToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(url);
  }

  // 6. REDIRECTION LOGIC (Authenticated users visiting /login)
  if (pathname === '/login' && accessToken && refreshToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/'; // or a universal entry point like /dashboard
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

/**
 * Matcher configuration from 'quan-ly-nha-hang-fe' reference.
 * It targets all routes except for API, static files, and generic assets.
 * It also skips execution on router prefetches to save resources.
 */
export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
