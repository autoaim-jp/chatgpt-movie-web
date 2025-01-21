#!/bin/bash

SCRIPT_DIR_PATH=$(dirname "$0")/

source ${SCRIPT_DIR_PATH}../../setting/.env

PROMPT_TEXT=$(cat ${SCRIPT_DIR_PATH}asset/prompt.txt)
NARRATION_CSV=$(cat ${SCRIPT_DIR_PATH}asset/narration.csv)

echo $PROMPT_TEXT

curl -X POST \
  -d "prompt=${PROMPT_TEXT}" \
  -d "narrationCsv=${NARRATION_CSV}" \
  http://${MOVIE_API_IP}:${MOVIE_API_PORT}/api/v1/prompt/register/chatgpt

