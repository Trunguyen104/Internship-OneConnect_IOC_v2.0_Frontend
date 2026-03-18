# ============================================================
# Bước 1: deps — cài packages (cache layer riêng)
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# ============================================================
# Bước 2: builder — build Next.js standalone
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_API_URL được bake vào JS lúc build (client-side URL)
# BE_URL là server-side runtime env — KHÔNG cần ARG ở đây
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:3000}

# Tắt worker threads để tránh lỗi EPERM trên một số môi trường CI/Linux
ENV NEXT_DISABLE_WORKER_THREADS=1
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ============================================================
# Bước 3: runner — image production tối giản (~200MB thay vì ~1GB)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Non-root user để bảo mật
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Dùng đúng standalone output (next.config.mjs đã có output: 'standalone')
# Không cần copy toàn bộ node_modules
COPY --from=builder /app/public ./public
RUN mkdir .next && chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Dùng node server.js (standalone) thay vì npm start
CMD ["node", "server.js"]
