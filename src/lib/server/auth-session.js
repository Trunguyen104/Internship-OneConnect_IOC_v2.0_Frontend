import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AUTH_COOKIE_ACCESS, AUTH_COOKIE_REFRESH } from '@/lib/auth/cookie-names';
import { normalizeRoleToId } from '@/lib/auth/role';
import { resolveAuthBaseUrl } from '@/lib/server/backend-url';

const AUTH_BASE = resolveAuthBaseUrl();

async function fetchMe(accessToken) {
  if (!accessToken) return null;

  const res = await fetch(`${AUTH_BASE}/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!res.ok) return null;

  const json = await res.json().catch(() => null);
  const payload = json?.data ?? json;
  const role = normalizeRoleToId(payload?.roleId ?? payload?.roleID ?? payload?.role);

  if (!role) return null;
  return { role, payload };
}

async function refreshWithCookie(refreshToken) {
  if (!refreshToken) return null;

  const res = await fetch(`${AUTH_BASE}/tokens/refresh`, {
    method: 'POST',
    headers: {
      Cookie: `refreshToken=${refreshToken}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) return null;
  const json = await res.json().catch(() => null);
  const payload = json?.data ?? json;
  const role = normalizeRoleToId(payload?.roleId ?? payload?.roleID ?? payload?.role);

  if (!role) return null;
  return { role, payload };
}

export async function requireServerAuth(allowedRoles = []) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIE_ACCESS)?.value;
  const refreshToken = cookieStore.get(AUTH_COOKIE_REFRESH)?.value;

  if (!accessToken && !refreshToken) {
    redirect('/login');
  }

  let session = await fetchMe(accessToken);
  if (!session && refreshToken) {
    session = await refreshWithCookie(refreshToken);
  }

  if (!session) {
    redirect('/login');
  }

  if (allowedRoles.length > 0) {
    const allowed = new Set(allowedRoles.map((r) => normalizeRoleToId(r)));
    if (!allowed.has(session.role)) {
      redirect('/unauthorized');
    }
  }

  return session;
}
