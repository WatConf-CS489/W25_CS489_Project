#!/bin/bash

set -e

source .venv/bin/activate

flask db upgrade
gunicorn "$FLASK_APP"
