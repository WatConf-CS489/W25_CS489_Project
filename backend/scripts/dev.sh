#!/bin/bash

set -e

uv sync --frozen

source .venv/bin/activate

if [[ $# -eq 0 ]]; then
    gunicorn src --reload --log-level debug
else
    "$@"
fi
