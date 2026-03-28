import { NextResponse } from 'next/server';

import { API_MESSAGES } from '@/constants/auth/uiText';
import { resolveAuthBaseUrl } from '@/lib/server/backend-url';

const BE_URL = resolveAuthBaseUrl();

export async function POST(req) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ message: API_MESSAGES.ERROR.INVALID_PAYLOAD }, { status: 400 });
    }

    const resetRequestUrl = `${BE_URL}/passwords/reset-request`;
    let res;

    try {
      res = await fetch(resetRequestUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (upstreamError) {
      console.error('RESET REQUEST UPSTREAM ERROR:', upstreamError);
      return NextResponse.json(
        { message: API_MESSAGES.ERROR.SERVICE_UNAVAILABLE },
        { status: 502 }
      );
    }

    const rawBody = await res.text();
    let data = {};
    try {
      data = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      data = { message: rawBody || API_MESSAGES.ERROR.UNEXPECTED_RESPONSE };
    }

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('RESET REQUEST ERROR:', err);
    return NextResponse.json({ message: API_MESSAGES.ERROR.SERVER_ERROR }, { status: 500 });
  }
}
