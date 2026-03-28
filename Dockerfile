FROM node:20-alpine AS base

WORKDIR /app

# Install OpenSSL, which is required by Prisma on Alpine Linux
RUN apk add --no-cache openssl

ARG JWT_SECRET
ARG ALLOWED_ORIGINS
ARG DATABASE_URL
ARG USE_POSTGRES
ARG NEXT_SERVER_ACTIONS_ENCRYPTION_KEY

# ----------------------------------------------------------------------------------

FROM base AS deps

WORKDIR /app

# Copy essential files
COPY package.json package-lock.json* ./
COPY scripts ./scripts/
COPY prisma/schema.prisma.template ./prisma/schema.prisma.template

RUN npm ci --legacy-peer-deps

# ----------------------------------------------------------------------------------

FROM base AS builder

WORKDIR /app
ENV JWT_SECRET=$JWT_SECRET
ENV ALLOWED_ORIGINS=$ALLOWED_ORIGINS
ENV DATABASE_URL=$DATABASE_URL
ENV USE_POSTGRES=$USE_POSTGRES
ENV NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=$NEXT_SERVER_ACTIONS_ENCRYPTION_KEY

# Copy essential files
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/scripts ./scripts/
COPY --from=deps /app/prisma/schema.prisma.template ./prisma/schema.prisma.template
COPY . .

RUN npm run db:generate
RUN npm run db:push
RUN npm run build

# ----------------------------------------------------------------------------------
    
FROM base AS runner

WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Copy essential files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 9500

ENV PORT=9500
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

# Use a common command that does nothing but wait
#CMD ["tail", "-f", "/dev/null"]