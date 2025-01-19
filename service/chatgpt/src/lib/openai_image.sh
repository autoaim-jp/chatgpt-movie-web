#!/bin/bash

# output
RESULT_IMAGE_FILE_PATH="${1:-"/tmp/generated_image.png"}"
TMP_JSON_FILE_PATH="${2:-"/tmp/result.json"}"
PROMPT_JSON_FILE_PATH="${3:-"/tmp/prompt.json"}"

# input
PROMPT="${4:-"cat"}"

# jq を使用して JSON_STR を生成
# MODEL_NAME="dall-e-2"
MODEL_NAME="dall-e-3"
JSON_STR=$(jq -n --arg prompt "$PROMPT" --arg model "$MODEL_NAME" --arg n "1" --arg size "1024x1024" \
  '{
    model: $model,
    prompt: $prompt,
    n: ($n | tonumber),
    size: $size
  }')

echo "$JSON_STR" > $PROMPT_JSON_FILE_PATH

curl https://api.openai.com/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_CHATGPT_API_KEY" \
  -d "$JSON_STR" -o $TMP_JSON_FILE_PATH

IMAGE_URL=$(jq -r 'try .data[0].url // empty' ${TMP_JSON_FILE_PATH})

if [[ -n "$IMAGE_URL" ]]; then
  echo "$IMAGE_URL"
  curl -o ${RESULT_IMAGE_FILE_PATH} "${IMAGE_URL}"
else
  echo "url not found."
  cat $TMP_JSON_FILE_PATH
fi


