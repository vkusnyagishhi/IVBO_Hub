FROM oven/bun:latest AS base

FROM base AS deps
WORKDIR /deps
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

FROM base AS build
WORKDIR /build
COPY --from=deps /deps/node_modules node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN bun run build

FROM base
WORKDIR /serve
RUN apk --no-cache add curl
RUN bun add sharp
RUN mkdir .next

COPY --from=build /build/public ./public
COPY --from=build /build/.next/standalone ./
COPY --from=build /build/.next/static ./.next/static

HEALTHCHECK CMD curl -f http://localhost:3000 || exit 1

ENV HOSTNAME "0.0.0.0"

CMD [ "bun", "server.js" ]