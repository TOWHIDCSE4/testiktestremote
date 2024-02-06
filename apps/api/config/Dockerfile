FROM node:18-alpine AS base

RUN npm install -g turbo
ARG API_PORT
ENV API_PORT ${API_PORT}

ARG ORIGINS
ENV ORIGINS ${ORIGINS}

ARG ENCRYPT_KEY
ENV ENCRYPT_KEY ${ENCRYPT_KEY}

ARG SIGN_KEY
ENV SIGN_KEY ${SIGN_KEY}

ARG MONGO_URL
ENV MONGO_URL ${MONGO_URL}

ARG REDIS_URL
ENV REDIS_URL ${REDIS_URL}

ARG SENTRY_DSN
ENV SENTRY_DSN ${SENTRY_DSN}




FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app
COPY . .
RUN turbo prune api --docker

FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install

COPY --from=builder /app/out/full .
COPY turbo.json turbo.json

RUN npx turbo build --filter=api...

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=installer /app .

RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs

CMD node apps/api/build/index.js
