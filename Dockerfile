# syntax=docker/dockerfile:1
####################################################################
# ABCD Ltd — Next.js (standalone) + Prisma + SQLite
# Multi-stage build optimized for Coolify / Docker deployment
####################################################################

# ---------- Stage 1: deps ----------
FROM oven/bun:1 AS deps
WORKDIR /app

# Copy lockfile + manifest for reproducible installs
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ---------- Stage 2: builder ----------
FROM oven/bun:1 AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client (needed at build time for type-check + bundling)
RUN bun run db:generate

# Build Next.js (output: standalone) + copy static & public into standalone
RUN bun run build

# ---------- Stage 3: runner (minimal production image) ----------
FROM oven/bun:1 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# Default DB location — mount a volume here in Coolify for persistence
ENV DATABASE_URL="file:/app/db/custom.db"

# Install only what's needed to run prisma CLI + seed + node server
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# 1. Standalone Next.js server (includes minimal node_modules for runtime)
COPY --from=builder /app/.next/standalone ./
# 2. Static assets & public files (copied next to standalone)
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
# 3. Prisma schema + generated client + CLI (for db push at startup)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
# 4. Seed script (creates admin user + default SEO on first run)
COPY --from=builder /app/scripts ./scripts

# Ensure the DB directory exists (will be mounted as a volume in Coolify)
RUN mkdir -p /app/db

EXPOSE 3000

# Startup sequence:
#   1. prisma db push  → create/migrate SQLite schema
#   2. seed            → create admin user if missing (idempotent)
#   3. node server.js  → start Next.js standalone server
CMD ["sh", "-c", "bunx prisma db push --accept-data-loss && bun scripts/seed.ts && node .next/standalone/server.js"]
