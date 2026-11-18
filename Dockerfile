FROM node:24-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json ./
RUN npm i -g "$(node -p "require('./package.json').packageManager")"

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
ENV HUSKY=0
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are inlined into the bundle and env.mjs validates the
# whole schema during `next build`, so every variable must be present here.
# Keep this list in sync with env.mjs.
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ARG AUTH_API_URL
ARG SSO_ALLOWED_ORIGINS
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_MRTT_SITE
ARG NEXT_PUBLIC_AUTH_URL
ARG NEXT_PUBLIC_ANALYSIS_API_URL
ARG NEXT_PUBLIC_ANALYSIS_API_PATH
ARG NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
ARG NEXT_PUBLIC_PLANET_API_KEY
ARG NEXT_PUBLIC_TRANSIFEX_API_KEY
ARG NEXT_PUBLIC_SMTP_ADDRESS
ARG NEXT_PUBLIC_SMTP_PASSWORD
ARG NEXT_PUBLIC_SMTP_PORT
ARG NEXT_PUBLIC_SMTP_USER_NAME
ARG NEXT_PUBLIC_GA_ID
ARG NEXT_PUBLIC_VERCEL_ENV
ARG NEXT_PUBLIC_FEATURED_FLAGS
ARG NEXT_PUBLIC_ENVIRONMENT
ARG NEXT_PUBLIC_FAKE_NEWS_DATE

RUN pnpm build

FROM node:24-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000
CMD ["node", "server.js"]
