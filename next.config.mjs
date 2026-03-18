/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Disabled to avoid Windows EPERM spawn failures in `next build` for this repo.
  reactCompiler: false,
  // Use worker_threads instead of spawning child processes (fixes `spawn EPERM` on locked-down Windows).
  experimental: { workerThreads: true },
  // CI/Windows environments can hit EPERM when Next spawns the typecheck worker.
  // Local dev still gets editor/tsserver type safety.
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
