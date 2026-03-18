import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BE_URL = process.env.BE_URL || 'http://localhost:5050';
const targetRoot = BE_URL.toLowerCase().endsWith('/api') ? BE_URL.slice(0, -4) : BE_URL;

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${targetRoot}/uploads/:path*`,
      },
      {
        source: '/Uploads/:path*',
        destination: `${targetRoot}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
