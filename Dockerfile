# syntax = docker/dockerfile:1
# Use a minimal base image
FROM node:18-alpine AS base

# Install dependencies only when needed (Dependencies Stage)
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code (Builder Stage)
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image, copy only essential files (Runner Stage)
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

# Setup Non-Root User
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# The Fix: Copying Standalone and Public files to the root
# The standalone build puts the /public folder in the root of the .next/standalone directory.
COPY --from=builder /app/public ./public 
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
