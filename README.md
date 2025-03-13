# WatConfessions

W25 CS489 (Secure Programming) Project

## Setup

After checking out this repo, make sure you configure git-crypt.
1. Install git-crypt, make sure it's in your PATH (check: you should see help text when you run `git crypt`)
    - Windows/Linux: [GitHub Release](https://github.com/AGWA/git-crypt/releases/tag/0.7.0)
    - macOS: `brew install git-crypt`
2. Place `crypt.key` in the repo inside the `crypt/` directory (ask Kabir for this file)
3. Run `make`, which will automatically decrypt the secrets for you.

Note: `crypt.key` should be treated as highly sensitive. It's gitignored but still be VERY careful to not check it in.

## Development

If you just want to run the BE+FE,

1. Install [Docker](https://www.docker.com)
2. Run `make`

You can then access the website at <https://local.kabir.dev> (points to `localhost:443`).

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

## Testing

### Pythonfuzz

You can run the fuzzer with `./scripts/fuzz.sh <target> [args...]`. For example,
```sh
./scripts/fuzz.sh crypto
```

To list all available fuzz targets, run `./scripts/fuzz.sh` by itself.
