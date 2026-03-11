import { NextResponse } from 'next/server';

const GENERIC_BE_URL = process.env.BE_URL || 'http://localhost:5050';
const BE_URL = GENERIC_BE_URL.includes('/api/auth') ? GENERIC_BE_URL : `${GENERIC_BE_URL}/api/auth`;

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
      credentials: 'include',
    });

    const data = await res.json();

    // Use getSetCookie() to handle multiple Set-Cookie headers correctly (Node.js 18+)
    const setCookies = res.headers.getSetCookie();

    let accessToken = null;
    let refreshToken = null;

    setCookies.forEach((cookieStr) => {
      const lower = cookieStr.toLowerCase();
      if (lower.startsWith('accesstoken=')) {
        accessToken = cookieStr.split(';')[0].split('=')[1];
      } else if (lower.startsWith('refreshtoken=')) {
        refreshToken = cookieStr.split(';')[0].split('=')[1];
      }
    });

    const response = NextResponse.json({
      email: data.data?.email,
      role: data.data?.role,
      expiresIn: data.data?.expiresIn,
      accessToken, // Crucial for client-side sessionStorage
    });

    const isProd = process.env.NODE_ENV === 'production';

    if (accessToken) {
      response.cookies.set('accessToken', accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        path: '/',
        maxAge: data.data?.expiresIn || 3600,
      });
    }

    if (refreshToken) {
      response.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        path: '/',
        maxAge: Math.floor(data.data?.refreshTokenExpiresIn) || 60 * 60 * 24 * 30,
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

    const cookieOptions = {
      httpOnly: true,
      path: '/',
      maxAge: 0,
    };

    response.cookies.set('accessToken', '', cookieOptions);
    response.cookies.set('refreshToken', '', cookieOptions);

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
    const refreshToken = req.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
    }

    const refreshUrl = `${BE_URL}/tokens/refresh`;
    const res = await fetch(refreshUrl, {
      method: 'POST',
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
      credentials: 'include',
    });

    if (!res.ok) {
      return NextResponse.json({ message: 'Refresh failed' }, { status: 401 });
    }

    const data = await res.json();
    const setCookies = res.headers.getSetCookie();
    let newAccessToken = null;

    setCookies.forEach((cookieStr) => {
      const lower = cookieStr.toLowerCase();
      if (lower.startsWith('accesstoken=')) {
        newAccessToken = cookieStr.split(';')[0].split('=')[1];
      }
    });

    const response = NextResponse.json({
      success: true,
      role: data.data?.role,
      accessToken: newAccessToken, // Crucial for client-side retry
    });

    if (newAccessToken) {
      response.cookies.set('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: data.data?.expiresIn || 3600,
      });
    }

    return response;
  } catch (err) {
    console.error('REFRESH ERROR:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
