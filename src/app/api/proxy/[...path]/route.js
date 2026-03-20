import { NextResponse } from 'next/server';

import { CONFIG } from '@/constants/common/config';
import { resolveApiRoot } from '@/lib/server/backend-url';

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

    // Bypass v1 for specific routes (like student evaluations)
    const isV1Bypass = CONFIG.V1_BYPASS_ROUTES.some((route) => pathStr.startsWith(route));

    const url = isV1Bypass
      ? `${API_ROOT}/${pathStr}${searchString}`
      : `${API_ROOT}/v1/${pathStr}${searchString}`;

    console.log(`PROXY TARGET: ${req.method} ${url}`);

    const headers = new Headers();
    const contentType = req.headers.get('content-type');
    if (contentType) {
      headers.set('Content-Type', contentType);
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
    console.log(`PROXY RESPONSE: ${res.status} from ${url}`);

    const contentTypeRes = res.headers.get('content-type');
    const contentDisposition = res.headers.get('content-disposition');

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`PROXY BACKEND ERROR: ${res.status} - ${errorText}`);
      return new NextResponse(errorText, {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Zero-Touch Streaming for data integrity
    const responseHeaders = new Headers();
    if (contentTypeRes) responseHeaders.set('Content-Type', contentTypeRes);
    if (contentDisposition) responseHeaders.set('Content-Disposition', contentDisposition);

    return new NextResponse(res.body, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(`PROXY EXCEPTION: ${error.message}`);
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
