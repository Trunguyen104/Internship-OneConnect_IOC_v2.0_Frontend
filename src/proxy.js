import { NextResponse } from 'next/server';

export function proxy(request) {
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const pathname = request.nextUrl.pathname;

  // REMOVE the forced redirect to /student/space when hitting /login with a token
  // because we handle role-based redirection on the client side in LoginPage.jsx.
  // We can just redirect to a neutral route or let the client decide.
  if (pathname === '/login' && refreshToken) {
    // If they already have a token and visit /login, we redirect them to a common place,
    // BUT since we just logged in, the set-cookie might trigger middleware.
    // Let's redirect to '/' and let page.js handle it, or just let it pass and let client side redirect.
    // Actually, if we let it pass, the login page will render, check token, and redirect.
    // Or we use a tiny trick: don't redirect here immediately on /login if they are POSTing to auth.
    // Wait, middleware runs on requests. A request to `/login` GET will redirect.
    // A request to `/login` after successful POST will set cookie. The next navigation to `/dashboard`
    // will have the cookie, and pass the `isProtected` check.
    // So if they visit `/login` while ALREADY logged in, where do they go?
    // Let's redirect them to '/' which can then redirect them appropriately, OR
    // simply turn off this forced `/student/space` redirect!
    // Let's redirect to `/internship-groups` for now as a default fallback,
    // but the client-side router.push('/dashboard') for HR will take precedence since it happens directly
    // on the client without a full page reload hitting middleware for /login.
    // Actually, middleware intercepts all router.push()! If HR user clicks login -> POST /api/auth sets cookie -> router.push('/dashboard') -> middleware gets GET /dashboard -> passes protected check -> OK.
    // Why did it go to /student? Because `getMe` failed or because `router.push('/internship-groups')` ran!
  }

  const isProtected =
    pathname.startsWith('/student') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/profile');

  if (isProtected && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/dashboard/:path*', '/profile/:path*', '/login'],
};
