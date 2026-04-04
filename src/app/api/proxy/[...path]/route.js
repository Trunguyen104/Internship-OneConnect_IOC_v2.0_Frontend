import { NextResponse } from 'next/server';

import { resolveApiRoot } from '@/lib/server/backend-url';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const API_ROOT = resolveApiRoot();

async function handler(req, { params }) {
  try {
    const resolvedParams = await params;
    const { path } = resolvedParams;
    const reqUrl = new URL(req.url);
    const searchString = reqUrl.search;

    if (!path || !Array.isArray(path)) {
      throw new Error(`Path is missing or invalid. Details: ${JSON.stringify(resolvedParams)}`);
    }

    const pathStr = path.join('/');

    const url = `${API_ROOT}/${pathStr}${searchString}`;

    const headers = new Headers();
    const contentType = req.headers.get('content-type');
    if (contentType) {
      headers.set('Content-Type', contentType);
    }

    // Forward standard headers for backend compatibility
    const pathString = path.join('/');
    if (pathString.includes('user-management')) {
      headers.set('accept', 'text/plain, application/json, */*');
    }

    // Extract accessToken from HttpOnly cookies securely on the server
    const accessToken = req.cookies.get('accessToken')?.value;
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    } else {
      // Fallback to client-provided header if absolutely necessary,
      // but ideally we rely on the cookie we just set.
      const authorization = req.headers.get('authorization');
      if (authorization) {
        headers.set('Authorization', authorization);
      }
    }

    const requestOptions = {
      method: req.method,
      headers,
      cache: 'no-store',
    };

    if (!['GET', 'HEAD'].includes(req.method)) {
      // Use arrayBuffer to preserve binary data (important for multipart/form-data uploads)
      const buffer = await req.arrayBuffer();
      requestOptions.body = buffer;
      // 'duplex' is required when passing a body stream/buffer in some environments
      requestOptions.duplex = 'half';
    }

    const res = await fetch(url, requestOptions);

    const contentTypeRes = res.headers.get('content-type');
    const contentDisposition = res.headers.get('content-disposition');

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`PROXY BACKEND ERROR: ${res.status} - ${errorText}`);
      return new NextResponse(errorText, {
        status: res.status,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });
    }

    // Zero-Touch Streaming for data integrity
    const responseHeaders = new Headers();
    if (contentTypeRes) responseHeaders.set('Content-Type', contentTypeRes);
    if (contentDisposition) responseHeaders.set('Content-Disposition', contentDisposition);
    responseHeaders.set('Cache-Control', 'no-store, max-age=0');
    responseHeaders.set('Pragma', 'no-cache');
    responseHeaders.set('Expires', '0');

    return new NextResponse(res.body, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(`PROXY EXCEPTION: ${error.message}`);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
