const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export async function httpGet(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
