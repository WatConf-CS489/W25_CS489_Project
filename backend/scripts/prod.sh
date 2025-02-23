#!/bin/bash

set -e

flask db upgrade
gunicorn src
