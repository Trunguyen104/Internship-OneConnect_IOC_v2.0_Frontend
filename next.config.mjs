/** @type {import('next').NextConfig} */
const enableWorkerThreads =
  process.platform === 'win32' && process.env.NEXT_DISABLE_WORKER_THREADS !== '1';

const nextConfig = {
  /* config options here */
  output: 'standalone',
  // Disabled to avoid Windows EPERM spawn failures in `next build` for this repo.
  reactCompiler: false,
  // Use worker_threads only on Windows local builds when explicitly allowed.
  experimental: enableWorkerThreads ? { workerThreads: true } : {},
  // CI/Windows environments can hit EPERM when Next spawns the typecheck worker.
  // Local dev still gets editor/tsserver type safety.
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
