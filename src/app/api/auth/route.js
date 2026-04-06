import { NextResponse } from 'next/server';

import { AUTH_COOKIE_ACCESS, AUTH_COOKIE_REFRESH } from '@/lib/auth/cookie-names';
import { applySessionCookies, clearSessionCookies } from '@/lib/server/auth-cookies';
import { resolveAuthBaseUrl } from '@/lib/server/backend-url';

const BE_URL = resolveAuthBaseUrl();

function parseTokensFromHeaders(headers) {
  let setCookies = [];

  if (typeof headers.getSetCookie === 'function') {
    setCookies = headers.getSetCookie();
  } else {
    const combinedSetCookie = headers.get('set-cookie');
    if (combinedSetCookie) {
      setCookies = combinedSetCookie.split(/,(?=\s*[A-Za-z0-9_-]+=)/);
    }
  }

  const tokens = {};

  setCookies.forEach((cookieStr) => {
    const parts = cookieStr.split(';')[0].split('=');
    if (parts.length >= 2) {
      const name = parts[0].trim().toLowerCase();
      const value = parts[1].trim();

      if (name === 'accesstoken') tokens.accessToken = value;
      if (name === 'refreshtoken') tokens.refreshToken = value;
    }
  });

  return tokens;
}

async function parseUpstreamJson(res) {
  const rawBody = await res.text();
  try {
    return rawBody ? JSON.parse(rawBody) : {};
  } catch {
    return { message: rawBody || 'Unexpected upstream response' };
  }
}

async function fetchMe(accessToken) {
  if (!accessToken) return null;

  const res = await fetch(`${BE_URL}/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) return null;
  const data = await parseUpstreamJson(res);
  return data?.data ?? null;
}

async function refreshSession(refreshToken) {
  if (!refreshToken) {
    return { ok: false, status: 401, data: { message: 'No refresh token' } };
  }

  const res = await fetch(`${BE_URL}/tokens/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `refreshToken=${refreshToken}`,
    },
    cache: 'no-store',
  });

  const data = await parseUpstreamJson(res);
  const tokens = parseTokensFromHeaders(res.headers);
  return { ok: res.ok, status: res.status, data, tokens };
}

/**
 * LOGIN
 * POST /api/auth
 */
export async function POST(req) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ message: 'Invalid request payload' }, { status: 400 });
    }

    const loginUrl = `${BE_URL}/login`;
    let res;

    try {
      res = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (upstreamError) {
      console.error('LOGIN UPSTREAM ERROR:', upstreamError);
      return NextResponse.json({ message: 'Authentication service unavailable' }, { status: 502 });
    }

    const data = await parseUpstreamJson(res);

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    const { accessToken, refreshToken } = parseTokensFromHeaders(res.headers);

    const response = NextResponse.json({
      email: data.data?.email,
      role: data.data?.role,
      unitId: data.data?.unitId,
      expiresIn: data.data?.expiresIn,
      refreshTokenExpiresIn: data.data?.refreshTokenExpiresIn,
    });

    const accessMaxAge = data.data?.expiresIn || 60 * 60 * 24;
    const refreshMaxAge = data.data?.refreshTokenExpiresIn || 60 * 60 * 24 * 7;
    applySessionCookies(response, accessToken, refreshToken, accessMaxAge, refreshMaxAge);

    return response;
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

/**
 * LOGOUT
 * DELETE /api/auth
 */
export async function DELETE(req) {
  try {
    const refreshToken = req.cookies.get(AUTH_COOKIE_REFRESH)?.value;

    if (refreshToken) {
      await fetch(`${BE_URL}/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
    }

    const response = NextResponse.json({ message: 'Logged out' });
    clearSessionCookies(response);

    return response;
  } catch (err) {
    console.error('LOGOUT ERROR:', err);
    const response = NextResponse.json({
      message: 'Logout failed upstream, local session cleared',
    });
    clearSessionCookies(response);
    return response;
  }
}

/**
 * REFRESH TOKEN
 * PUT /api/auth
 */
export async function PUT(req) {
  try {
    const oldRefreshToken = req.cookies.get(AUTH_COOKIE_REFRESH)?.value;
    const refreshed = await refreshSession(oldRefreshToken);
    if (!refreshed.ok) {
      return NextResponse.json(refreshed.data, { status: refreshed.status });
    }

    const response = NextResponse.json({
      success: true,
      role: refreshed.data?.data?.role,
    });
    applySessionCookies(
      response,
      refreshed.tokens.accessToken,
      refreshed.tokens.refreshToken,
      refreshed.data?.data?.expiresIn || 60 * 60 * 24,
      refreshed.data?.data?.refreshTokenExpiresIn || 60 * 60 * 24 * 7
    );

    return response;
  } catch (err) {
    console.error('REFRESH ERROR:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

/**
 * SESSION
 * GET /api/auth
 */
export async function GET(req) {
  try {
    const accessToken = req.cookies.get(AUTH_COOKIE_ACCESS)?.value;
    const refreshToken = req.cookies.get(AUTH_COOKIE_REFRESH)?.value;

    let me = await fetchMe(accessToken);
    if (me) {
      return NextResponse.json({
        authenticated: true,
        role: me.roleId ?? me.roleID ?? me.role,
        email: me.email ?? me.Email,
        unitId: me.unitId ?? me.unitID,
      });
    }

    const refreshed = await refreshSession(refreshToken);
    if (!refreshed.ok) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const response = NextResponse.json({
      authenticated: true,
      role: refreshed.data?.data?.role,
      email: refreshed.data?.data?.email,
      unitId: refreshed.data?.data?.unitId,
    });

    applySessionCookies(
      response,
      refreshed.tokens.accessToken,
      refreshed.tokens.refreshToken,
      refreshed.data?.data?.expiresIn || 60 * 60 * 24,
      refreshed.data?.data?.refreshTokenExpiresIn || 60 * 60 * 24 * 7
    );

    return response;
  } catch (err) {
    console.error('SESSION ERROR:', err);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
