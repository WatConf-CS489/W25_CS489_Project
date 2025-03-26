#!/bin/bash

docker compose run --rm -it backend python -m src.fuzz.fuzz "$@"
