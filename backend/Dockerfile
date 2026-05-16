FROM oven/bun:1 AS install
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:1 AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=install /app/node_modules ./node_modules
COPY . .

RUN bun run prisma:generate

EXPOSE 5000
CMD ["bun", "run", "start"]
