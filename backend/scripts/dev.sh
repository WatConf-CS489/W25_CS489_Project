#!/bin/bash

uv sync --frozen;

source .venv/bin/activate;

flask db upgrade;
gunicorn "$FLASK_APP" --reload --log-level debug;