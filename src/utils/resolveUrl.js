export const resolveResourceUrl = (url) => {
  if (!url) return '';

  // external URL
  if (url.startsWith('http')) return url;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';
  const normalizedBase = baseUrl.replace(/\/$/, '');

  // normalize path
  let cleanPath = url.replace(/\\/g, '/');

  // Find the position of 'Uploads' (case-insensitive) and keep everything from that point
  // This preserves the casing of the 'Uploads' part and everything after it.
  const uploadsMatch = cleanPath.match(/\/Uploads\//i);
  if (uploadsMatch) {
    cleanPath = cleanPath.substring(uploadsMatch.index);
  } else {
    // If 'Uploads' not found, just strip '/app' prefix if it exists
    cleanPath = cleanPath.replace(/^\/app/, '');
  }

  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }

  const resolved = normalizedBase + cleanPath;
  console.log('Resolved resource URL:', { original: url, resolved });

  return resolved;
};
