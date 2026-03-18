export async function login(data) {
  const payload = {
    email: data?.email,
    password: data?.password,
  };

  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || 'Login failed');
  }

  // /api/auth sets HttpOnly cookies and returns basic auth context for routing decisions.
  // Do not return tokens to the client (XSS risk).
  const auth = await res.json();
  return auth;
}

export async function logout() {
  const res = await fetch(`/api/auth`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Logout failed');
}

export async function refreshToken() {
  const res = await fetch('/api/auth', {
    method: 'PUT',
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Refresh failed');

  // /api/auth refresh returns basic auth context; tokens remain in HttpOnly cookies.
  return await res.json();
}
