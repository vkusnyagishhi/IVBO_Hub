FROM node:20.10.0

ENV NEXT_TELEMETRY_DISABLED 1
WORKDIR /code

COPY package.json pnpm-lock.yaml* ./
RUN npm i -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

ENV HOSTNAME "0.0.0.0"
CMD ["npm", "start"]