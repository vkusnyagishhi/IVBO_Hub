FROM node:20.10.0-alpine AS base

FROM base AS build
WORKDIR /build
RUN npm i -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile
ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm build

FROM base
WORKDIR /serve
RUN mkdir .next
COPY --from=build /build/public ./public
COPY --from=build /build/.next/standalone ./
COPY --from=build /build/.next/static ./.next/static

ENV NODE_ENV production
ENV HOSTNAME "0.0.0.0"
CMD ["node", "server.js"]
