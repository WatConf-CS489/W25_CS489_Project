#!/bin/bash

set -e

bun install --frozen-lockfile

if [[ $# -eq 0 ]]; then
    bun run dev
else
    "$@"
fi
