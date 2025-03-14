#!/bin/bash

set -e

uv sync --frozen

source .venv/bin/activate

if [[ $# -eq 0 ]]; then
    flask db upgrade
    gunicorn "$FLASK_APP" --reload --log-level debug
else
    "$@"
fi
