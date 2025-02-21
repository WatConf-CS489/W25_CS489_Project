#!/bin/bash

set -e

uv sync --frozen
uv run gunicorn src --reload --log-level debug
