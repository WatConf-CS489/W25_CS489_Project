FROM python:3.12
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /usr/src/app

COPY uv.lock pyproject.toml /usr/src/app/
RUN uv sync --frozen

EXPOSE 8000/tcp
ENTRYPOINT [ "uv", "run", "gunicorn", "--reload", "app:app" ]
