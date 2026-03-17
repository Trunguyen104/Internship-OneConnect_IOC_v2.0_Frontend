export const CONFIG = {
  useMocks: true,
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
  V1_BYPASS_ROUTES: ['students/me', 'project-resources'],
};
