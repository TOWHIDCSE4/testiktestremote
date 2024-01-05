FROM node:18-alpine AS base

RUN npm install -g turbo

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
