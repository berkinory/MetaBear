FROM oven/bun:1.3.6-slim AS base

FROM base AS deps
WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

FROM base AS builder
WORKDIR /app

ARG PUBLIC_WWW_URL
ENV PUBLIC_WWW_URL=$PUBLIC_WWW_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN bun run build

FROM base AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends adduser && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 astro && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=builder --chown=astro:nodejs /app/dist ./dist

USER astro

EXPOSE 4001

ENV NODE_ENV=production
ENV PORT=4001
ENV HOSTNAME="0.0.0.0"

CMD ["bunx", "serve", "./dist", "-l", "4001"]
