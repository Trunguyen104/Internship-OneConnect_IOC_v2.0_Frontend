import { NextResponse } from 'next/server';

const BASE = process.env.API_BASE_URL;

async function forward(req, pathParts) {
  if (!BASE) {
    return NextResponse.json({ message: 'Missing API_BASE_URL in .env.local' }, { status: 500 });
  }

  const url = new URL(req.url);
  const targetUrl = `${BASE}/${pathParts.join('/')}${url.search}`;

  const headers = new Headers(req.headers);
  headers.delete('host');

  const res = await fetch(targetUrl, {
    method: req.method,
    headers,
    body: req.method === 'GET' || req.method === 'HEAD' ? undefined : await req.arrayBuffer(),
    redirect: 'manual',
  });

  const body = await res.arrayBuffer();
  return new NextResponse(body, { status: res.status, headers: res.headers });
}

export async function GET(req, ctx) {
  return forward(req, ctx.params.path);
}
export async function POST(req, ctx) {
  return forward(req, ctx.params.path);
}
export async function PUT(req, ctx) {
  return forward(req, ctx.params.path);
}
export async function PATCH(req, ctx) {
  return forward(req, ctx.params.path);
}
export async function DELETE(req, ctx) {
  return forward(req, ctx.params.path);
}
