export const CONFIG = {
  // Bật mock bằng NEXT_PUBLIC_USE_MOCKS=true trong .env.local (dev only)
  // Production: biến này không được set → false → gọi API thật
  useMocks: process.env.NEXT_PUBLIC_USE_MOCKS === 'true',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
  V1_BYPASS_ROUTES: ['students/me'],
};
