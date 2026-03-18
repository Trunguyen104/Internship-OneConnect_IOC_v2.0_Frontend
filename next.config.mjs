/** @type {import('next').NextConfig} */

const nextConfig = {
  // Bắt buộc để Dockerfile standalone hoạt động đúng
  output: 'standalone',

  // Tắt React Compiler (tránh lỗi EPERM spawn trên Windows)
  reactCompiler: false,

  // Cho phép Next.js load ảnh từ domain ngoài
  // Thêm domain BE nếu serve ảnh trực tiếp từ BE (không qua Cloudinary)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        // Cho phép ảnh từ domain production
        protocol: 'https',
        hostname: 'iocv2.duckdns.org',
      },
      {
        // Fallback local dev
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },

  // Bỏ qua lỗi TypeScript lúc build (project dùng JS, không TS)
  // TODO: Xóa dòng này khi migrate sang TypeScript
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
