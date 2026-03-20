/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bắt buộc để Dockerfile standalone hoạt động đúng
  output: 'standalone',

  // Tắt React Compiler (tránh lỗi EPERM spawn trên Windows)
  reactCompiler: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'iocv2.duckdns.org',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
