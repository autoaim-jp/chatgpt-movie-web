#!/bin/bash

SCRIPT_DIR_PATH=$(dirname "$0")/
source ${SCRIPT_DIR_PATH}../../setting/.env

IMAGE_PROMPT=${1:-"cat"}

curl -X POST \
  -d "imagePrompt=${IMAGE_PROMPT}" \
  "http://${MOVIE_API_IP}:${MOVIE_API_PORT}/api/v1/prompt/register/image"

