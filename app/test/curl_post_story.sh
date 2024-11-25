#!/bin/bash

SCRIPT_DIR_PATH=$(dirname "$0")/


THEME_TEXT=${1:-"簡単な慣用句、教訓"}
TARGET_TEXT=${2:-"6歳の男の子"}

curl -X POST \
  -d "themeText=${THEME_TEXT}" \
  -d "targetText=${TARGET_TEXT}" \
  http://localhost:25673/api/v1/prompt/register/story

