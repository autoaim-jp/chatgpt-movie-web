#!/bin/bash

SCRIPT_DIR_PATH=$(dirname "$0")/
source ${SCRIPT_DIR_PATH}../../setting/.env

ls -lat service/movieApi/src/data/

curl "http://${MOVIE_API_IP}:${MOVIE_API_PORT}/api/v1/chatgpt/response/lookup?requestId=${1:-01JDF284PZF2YNFKPSM71VFMTE}"

