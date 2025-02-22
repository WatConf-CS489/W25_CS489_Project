# WatConfessions

W25 CS489 (Secure Programming) Project

## Development

If you just want to run the BE+FE,

1. Install [Docker](https://www.docker.com)
2. Run `make`

Both the BE and FE have hot reloading, so refreshing the page should be sufficient to update things. But in some cases (such as adding a new dependency) you may need to run `make` again to restart.

Run `make down` to fully shut down the containers.

### Frontend IDE Support

To get intellisense when working on the frontend locally,

1. Install [Bun](https://bun.sh)
2. Run `bun install` in the `frontend` directory
3. Install any necessary IDE extensions (e.g. TypeScript support in VSCode)

### Backend IDE Support

1. Install [uv](https://docs.astral.sh/uv/getting-started/installation/)
2. Run `uv sync` in the `backend` directory
3. Install any necessary IDE extensions (Python in VSCode)
4. Activate the virtual env at `backend/.venv` if necessary (not needed for VSC: already set in `settings.json`.)

### DB Stuff

- Create a new migration with `make revision`

## Production

Set `PROD=1`:

```bash
make PROD=1
```
