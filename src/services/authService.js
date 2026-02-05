export async function loginApi(data) {
  const res = await fetch('http://localhost:5000/api/Auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Sai email hoặc mật khẩu');
  }

  const token = await res.text();

  return token;
}
