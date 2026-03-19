import { NextResponse } from 'next/server';

function getTargetRoot() {
  const beUrl = process.env.BE_URL || 'http://localhost:5050';
  return beUrl.toLowerCase().endsWith('/api') ? beUrl.slice(0, -4) : beUrl;
}

// Proxy uploaded files from backend so the FE build can avoid `next.config` rewrites (functions)
// which break `experimental.workerThreads` (structured clone doesn't support functions).
export async function GET(_request, { params }) {
  const segs = Array.isArray(params?.path) ? params.path : [];
  const upstreamUrl = `${getTargetRoot()}/uploads/${segs.join('/')}`;

  const upstream = await fetch(upstreamUrl, { cache: 'no-store' });
  const headers = new Headers(upstream.headers);
  headers.delete('set-cookie');

  return new NextResponse(upstream.body, { status: upstream.status, headers });
}

export const dynamic = 'force-dynamic';
