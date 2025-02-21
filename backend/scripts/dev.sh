#!/bin/bash

set -e

uv sync --frozen
uv run gunicorn --reload app:app
