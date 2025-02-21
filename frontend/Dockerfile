FROM oven/bun:latest

WORKDIR /usr/src/app

COPY package.json bun.lock /usr/src/app/
RUN bun install --frozen-lockfile

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "dev" ]
