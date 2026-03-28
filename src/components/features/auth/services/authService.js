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

  // /api/auth refresh returns basic auth context; tokens remain in HttpOnly cookies.
  return await res.json();
}

export async function requestPasswordReset(email) {
  const res = await fetch('/api/auth/passwords/reset-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || result.errors || 'Request password reset failed');
  }
  return result;
}

export async function resetPassword(data) {
  const payload = {
    token: data?.token,
    newPassword: data?.newPassword,
    confirmPassword: data?.confirmPassword,
  };

  const res = await fetch('/api/auth/passwords/reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || result.errors || 'Reset password failed');
  }
  return result;
}

export async function changePassword(data) {
  const payload = {
    currentPassword: data?.currentPassword,
    newPassword: data?.newPassword,
    confirmPassword: data?.confirmPassword,
  };

  const res = await fetch('/api/auth/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Throwing the whole result object so caller can handle `validationErrors` if present
    throw result;
  }
  return result;
}
