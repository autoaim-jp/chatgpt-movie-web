#!/bin/bash

SCRIPT_DIR_PATH=$(dirname "$0")/

PROMPT_TEXT=$(cat ${SCRIPT_DIR_PATH}asset/prompt.txt)

echo $PROMPT_TEXT

curl -X POST \
  -d "prompt=${PROMPT_TEXT}" \
  http://localhost:25673/api/v1/prompt/register/chatgpt

