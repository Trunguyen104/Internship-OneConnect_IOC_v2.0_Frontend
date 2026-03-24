export const resolveResourceUrl = (url) => {
  if (!url) return '';

  // external URL
  if (url.startsWith('http')) return url;

  // Determine the target backend root
  const backendRoot = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';

  let cleanPath = url.replace(/\\/g, '/').trim();

  // If it starts with localhost:5050 or similar but no protocol
  if (
    cleanPath.startsWith('localhost:') ||
    (cleanPath.includes(':') && !cleanPath.includes('://'))
  ) {
    cleanPath = 'http://' + cleanPath;
  }

  // If already full URL, return it
  if (cleanPath.startsWith('http')) {
    // Ensure we solve potential protocol-relative or missing protocol issues
    return cleanPath;
  }

  // Special handling for Uploads to ensure they use backendRoot
  const resolved = backendRoot + (cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath);

  return resolved;
};
