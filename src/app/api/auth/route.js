import { NextResponse } from 'next/server';

const GENERIC_BE_URL = process.env.BE_URL || 'http://localhost:5050';
const BE_URL = GENERIC_BE_URL.includes('/api/v1/auth')
  ? GENERIC_BE_URL
  : `${GENERIC_BE_URL}/api/v1/auth`;

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

/**
 * LOGIN
 * POST /api/auth
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const loginUrl = `${BE_URL}/login`;

    const res = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const rawBody = await res.text();
    let data = {};
    try {
      data = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      data = { message: rawBody || 'Unexpected upstream response' };
    }

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    const { accessToken, refreshToken } = parseTokensFromHeaders(res.headers);

    const response = NextResponse.json({
      email: data.data?.email,
      role: data.data?.role,
      expiresIn: data.data?.expiresIn,
    });

    const isProd = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
    };

    if (accessToken) {
      response.cookies.set('accessToken', accessToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24,
      });
    }

    if (refreshToken) {
      response.cookies.set('refreshToken', refreshToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 7,
      });
    }

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
    const refreshToken = req.cookies.get('refreshToken')?.value;

    if (refreshToken) {
      fetch(`${BE_URL}/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      }).catch((e) => console.error('Backend logout failed', e));
    }

    const response = NextResponse.json({ message: 'Logged out' });

    const clearOptions = {
      httpOnly: true,
      path: '/',
      maxAge: 0,
    };

    response.cookies.set('accessToken', '', clearOptions);
    response.cookies.set('refreshToken', '', clearOptions);

    return response;
  } catch (err) {
    console.error('LOGOUT ERROR:', err);
    return NextResponse.json({ message: 'Logout failed' }, { status: 500 });
  }
}

/**
 * REFRESH TOKEN
 * PUT /api/auth
 */
export async function PUT(req) {
  try {
    const oldRefreshToken = req.cookies.get('refreshToken')?.value;

    if (!oldRefreshToken) {
      return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
    }

    const refreshUrl = `${BE_URL}/tokens/refresh`;
    const res = await fetch(refreshUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `refreshToken=${oldRefreshToken}`,
      },
    });

    const rawBody = await res.text();
    let data = {};
    try {
      data = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      data = { message: rawBody || 'Unexpected upstream response' };
    }

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    const { accessToken, refreshToken } = parseTokensFromHeaders(res.headers);

    const response = NextResponse.json({
      success: true,
      role: data.data?.role,
    });

    const isProd = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
    };

    if (accessToken) {
      response.cookies.set('accessToken', accessToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24,
      });
    }

    if (refreshToken) {
      response.cookies.set('refreshToken', refreshToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch (err) {
    console.error('REFRESH ERROR:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
