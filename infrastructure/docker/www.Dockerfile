FROM oven/bun:1.3.6-slim AS base

FROM base AS pruner
WORKDIR /app

RUN bun add -g turbo

COPY . .

RUN turbo prune www --docker

FROM base AS installer
WORKDIR /app

COPY --from=pruner /app/out/json/ .

COPY --from=pruner /app/out/bun.lock ./bun.lock

RUN bun install

COPY --from=pruner /app/out/full/ .

FROM installer AS builder
WORKDIR /app

ARG PUBLIC_WWW_URL=${PUBLIC_WWW_URL}
ENV PUBLIC_WWW_URL=$PUBLIC_WWW_URL

RUN bun run turbo build --filter=www

FROM base AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends adduser && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 astro && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=builder --chown=astro:nodejs /app/apps/www/dist ./dist

USER astro

EXPOSE 4001 

ENV NODE_ENV=production
ENV PORT=4001
ENV HOSTNAME="0.0.0.0"

CMD ["bunx", "serve", "./dist", "-l", "4001"]
