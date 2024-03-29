# Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json ./
RUN npm ci --audit-false

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

# Add sharp for optimization 
# See https://nextjs.org/docs/messages/install-sharp
RUN npm i --no-save sharp 


# Script needed for frontend to be able to react to env var changes at runtime
# With our current frontend structure some env vars have to be set at build time
# To still allow for configuration of the docker image via env vars we set placeholders at runtime
# and replace them at startup (e.g in the entry script)

# Set env variables to placeholders. This is necessary to allow replacing them during docker image startup
# Schmea: PLACEHOLDER_<var> 
ARG NEXT_PUBLIC_CLIENT_BASE_URL=PLACEHOLDER_NEXT_PUBLIC_CLIENT_BASE_URL
ARG NEXT_PUBLIC_API_BASE_URL_QUERY_CLIENT=PLACEHOLDER_NEXT_PUBLIC_API_BASE_URL_QUERY_CLIENT
ARG NEXT_PUBLIC_API_BASE_URL_QUERY_SERVER=PLACEHOLDER_NEXT_PUBLIC_API_BASE_URL_QUERY_SERVER
ARG NEXT_PUBLIC_API_BASE_URL_COMMAND=PLACEHOLDER_NEXT_PUBLIC_API_BASE_URL_COMMAND
ARG NEXT_PUBLIC_API_BASE_URL_AUTH_SERVER=PLACEHOLDER_NEXT_PUBLIC_API_BASE_URL_AUTH_SERVER
ARG NEXT_PUBLIC_API_BASE_URL_AUTH_CLIENT=PLACEHOLDER_NEXT_PUBLIC_API_BASE_URL_AUTH_CLIENT
ARG NEXT_PUBLIC_API_BASE_URL_IMAGE_SERVER=PLACEHOLDER_NEXT_PUBLIC_API_BASE_URL_IMAGE_SERVER
ARG NEXT_PUBLIC_API_BASE_URL_IMAGE_CLIENT=PLACEHOLDER_NEXT_PUBLIC_API_BASE_URL_IMAGE_CLIENT

RUN npm run build

FROM node:16-alpine AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Add entrypoint
COPY  --chown=nextjs:nodejs ./docker-entrypoint.sh ./entrypoint.sh 
RUN ["chmod", "+x", "/app/entrypoint.sh"]
ENTRYPOINT ["/app/entrypoint.sh"]

USER nextjs

CMD ["node", "server.js"]
