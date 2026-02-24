import { NextResponse } from 'next/server';

const BE_URL = 'http://localhost:5000/api/Auth';

/**
 * LOGIN
 * POST /api/auth
 */
export async function POST(req) {
  try {
    const body = await req.json();

    const res = await fetch(`${BE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!res.ok) {
      return NextResponse.json({ message: 'Sai email hoặc mật khẩu' }, { status: 401 });
    }

    const accessToken = await res.text();

    // Lấy refreshToken từ Set-Cookie của BE
    const setCookie = res.headers.get('set-cookie');
    let refreshToken = '';

    if (setCookie) {
      const match = setCookie.match(/refreshToken=([^;]+)/);
      if (match) refreshToken = match[1];
    }

    const response = NextResponse.json({ accessToken });

    if (refreshToken) {
      response.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
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
export async function DELETE() {
  const response = NextResponse.json({ message: 'Logged out' });

  response.cookies.set('refreshToken', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });

  return response;
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

    const res = await fetch(`${BE_URL}/refresh`, {
      method: 'POST',
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
      credentials: 'include',
    });

    if (!res.ok) {
      return NextResponse.json({ message: 'Refresh failed' }, { status: 401 });
    }

    const newAccessToken = await res.text();

    return NextResponse.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error('REFRESH ERROR:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
