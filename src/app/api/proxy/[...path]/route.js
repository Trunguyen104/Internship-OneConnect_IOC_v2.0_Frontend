// src/app/api/proxy/[...path]/route.js
import { NextResponse } from 'next/server';

const BE_URL = process.env.BE_URL || 'http://localhost:5050';

async function handler(req, { params }) {
  try {
    const resolvedParams = await params;
    const { path } = resolvedParams;
    const reqUrl = new URL(req.url);
    const searchString = reqUrl.search;

    if (!path || !Array.isArray(path)) {
      throw new Error(`Path is missing or invalid. Details: ${JSON.stringify(resolvedParams)}`);
    }

    // Construct target URL carefully
    const baseUrl = BE_URL.endsWith('/') ? BE_URL.slice(0, -1) : BE_URL;
    const pathStr = path.join('/');
    const url = baseUrl.toLowerCase().endsWith('/api')
      ? `${baseUrl}/${pathStr}${searchString}`
      : `${baseUrl}/api/v1/${pathStr}${searchString}`;

    console.log(`PROXY: ${req.method} ${url}`);

    const headers = new Headers();
    const contentType = req.headers.get('content-type');
    if (contentType) {
      headers.set('Content-Type', contentType);
    }
    const authorization = req.headers.get('authorization');
    if (authorization) {
      headers.set('Authorization', authorization);
    }

    const requestOptions = {
      method: req.method,
      headers,
      cache: 'no-store',
    };

    if (!['GET', 'HEAD'].includes(req.method)) {
      // Clone the request text to avoid stream consumption issues
      const bodyText = await req.text();
      requestOptions.body = bodyText;
      console.log(
        `PROXY PAYLOAD: ${bodyText.substring(0, 500)}${bodyText.length > 500 ? '...' : ''}`,
      );
    }

    const res = await fetch(url, requestOptions);
    console.log(`PROXY RESPONSE: ${res.status} from ${url}`);

    const contentTypeRes = res.headers.get('content-type');
    const data = await res.text();

    if (!res.ok) {
      console.error(`PROXY BACKEND ERROR: ${res.status} - ${data}`);
    }

    return new NextResponse(data, {
      status: res.status,
      headers: {
        'Content-Type': contentTypeRes || 'application/json',
      },
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

// src/app/api/proxy/[...path]/route.js
// import { NextResponse } from 'next/server';

// const BE_URL = process.env.BE_URL || 'http://localhost:5050';

// async function handler(req, { params }) {
//   try {
//     const resolvedParams = await Promise.resolve(params);
//     const { path } = resolvedParams;
//     const reqUrl = new URL(req.url);
//     const searchString = reqUrl.search;

//     if (!path || !Array.isArray(path)) {
//       throw new Error(`Path is missing or invalid. Details: ${JSON.stringify(resolvedParams)}`);
//     }

//     const url = `${BE_URL}/api/${path.join('/')}${searchString}`;

//     const headers = new Headers();
//     const contentType = req.headers.get('content-type');
//     if (contentType) {
//       headers.set('Content-Type', contentType);
//     }
//     const authorization = req.headers.get('authorization');
//     if (authorization) {
//       headers.set('Authorization', authorization);
//     }

//     const requestOptions = {
//       method: req.method,
//       headers,
//       cache: 'no-store', // Disable Next.js app router server cache
//     };

//     if (!['GET', 'HEAD'].includes(req.method)) {
//       requestOptions.body = req.body;
//       requestOptions.duplex = 'half';
//     }

//     const res = await fetch(url, requestOptions);

//     const data = await res.text();

//     return new NextResponse(data, {
//       status: res.status,
//       headers: {
//         'Content-Type': res.headers.get('content-type') || 'application/json',
//       },
//     });
//   } catch (error) {
//     return new NextResponse(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }

// export const GET = handler;
// export const POST = handler;
// export const PUT = handler;
// export const PATCH = handler;
// export const DELETE = handler;
