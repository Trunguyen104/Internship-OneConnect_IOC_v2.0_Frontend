export async function login(data) {
  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Login failed');
  }

  const { accessToken } = await res.json();

  return accessToken;
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
  sessionStorage.setItem('accessToken', accessToken);

  return accessToken;
}
