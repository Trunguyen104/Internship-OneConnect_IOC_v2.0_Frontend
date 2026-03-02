// src/app/api/proxy/[...path]/route.js
import { NextResponse } from 'next/server';

const BE_URL = process.env.BE_URL || 'http://localhost:5050';

async function handler(req, { params }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { path } = resolvedParams;
    const reqUrl = new URL(req.url);
    const searchString = reqUrl.search;

    if (!path || !Array.isArray(path)) {
      throw new Error(`Path is missing or invalid. Details: ${JSON.stringify(resolvedParams)}`);
    }

    const url = `${BE_URL}/api/${path.join('/')}${searchString}`;

    const res = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.get('authorization')
          ? { Authorization: req.headers.get('authorization') }
          : {}),
      },
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : await req.text(),
    });

    const data = await res.text();

    return new NextResponse(data, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'application/json',
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
