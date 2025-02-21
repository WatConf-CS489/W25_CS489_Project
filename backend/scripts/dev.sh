#!/bin/bash

set -e

uv sync --frozen
uv run gunicorn --reload src.app:app
