export async function login(data) {
  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || 'Login failed');
  }

  return result;
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

  const { accessToken } = await res.json();
  return accessToken;
}
