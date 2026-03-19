import { NextResponse } from 'next/server';
import { resolveBackendBaseUrl } from '@/lib/server/backend-url';

const BASE_BACKEND_URL = resolveBackendBaseUrl();

// Proxy uploaded files from backend so the FE build can avoid `next.config` rewrites (functions)
// which break `experimental.workerThreads` (structured clone doesn't support functions).
export async function GET(_request, { params }) {
  try {
    const resolvedParams = await params;
    const segs = Array.isArray(resolvedParams?.path) ? resolvedParams.path : [];
    const upstreamUrl = `${BASE_BACKEND_URL}/uploads/${segs.join('/')}`;

    const upstream = await fetch(upstreamUrl, { cache: 'no-store' });
    const headers = new Headers(upstream.headers);
    headers.delete('set-cookie');

    return new NextResponse(upstream.body, { status: upstream.status, headers });
  } catch (error) {
    console.error('UPLOADS PROXY ERROR:', error);
    return NextResponse.json({ message: 'Upload service unavailable' }, { status: 502 });
  }
}

export const dynamic = 'force-dynamic';
