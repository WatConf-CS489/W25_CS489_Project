FROM python:3.12
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /usr/src/app

EXPOSE 8000/tcp
ENTRYPOINT [ "scripts/dev.sh" ]
