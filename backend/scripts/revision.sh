#!/bin/bash

set -e

if [[ $# -eq 0 ]]; then
    read -p 'Message: ' message
else
    message="$@"
fi

docker compose run --rm backend flask db revision "$message"