import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { AUTH_COOKIE_ACCESS } from '@/lib/auth/cookie-names';

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, private',
  Pragma: 'no-cache',
};

/**
 * SignalR bridge (intentional exception to “no token in JS”):
 * The notification hub uses `NEXT_PUBLIC_API_URL` (often another origin). The SignalR client
 * must pass a bearer token; it cannot send HttpOnly cookies on that WebSocket handshake.
 * This handler reads `accessToken` from the HttpOnly cookie **on the server** and returns it
 * for a short-lived client use only (`accessTokenFactory`). Prefer POST to avoid GET caching.
 */
async function handleTokenRequest() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_ACCESS)?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'No active session' },
        { status: 401, headers: NO_STORE_HEADERS }
      );
    }

    return NextResponse.json({ accessToken: token }, { headers: NO_STORE_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: NO_STORE_HEADERS });
  }
}

export async function POST() {
  return handleTokenRequest();
}

/** Backwards-compatible; prefer POST. */
export async function GET() {
  return handleTokenRequest();
}
