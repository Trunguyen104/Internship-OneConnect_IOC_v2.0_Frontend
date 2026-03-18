import { NextResponse } from 'next/server';
import { resolveAuthBaseUrl } from '@/lib/server/backend-url';

const BE_URL = resolveAuthBaseUrl();

export async function POST(req) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ message: 'Invalid request payload' }, { status: 400 });
    }

    const accessToken = req.cookies.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ message: 'Missing access token' }, { status: 401 });
    }

    let res;
    try {
      res = await fetch(`${BE_URL}/passwords/change`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });
    } catch (upstreamError) {
      console.error('CHANGE PASSWORD UPSTREAM ERROR:', upstreamError);
      return NextResponse.json({ message: 'Authentication service unavailable' }, { status: 502 });
    }

    const text = await res.text();
    const contentType = res.headers.get('content-type') || 'application/json';

    return new NextResponse(text, {
      status: res.status,
      headers: { 'Content-Type': contentType },
    });
  } catch (err) {
    console.error('CHANGE PASSWORD ERROR:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
