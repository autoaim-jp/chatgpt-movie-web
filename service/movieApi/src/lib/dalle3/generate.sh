#!/bin/bash

# output
OUTPUT_IMAGE_FILE_PATH="${1:-"/tmp/generated_image.png"}"
JSON_FILE_PATH="${2:-"/tmp/result.json"}"

# input
OPENAI_API_KEY="${3:-"deadbeef"}"
PROMPT="${4:-"hello"}"

# デバッグ用に引数を表示
echo $JSON_FILE_PATH
# echo $OPENAI_API_KEY
echo $PROMPT

# jq を使用して JSON_STR を生成
MODEL_NAME="dall-e-2"
# MODEL_NAME="dall-e-3"
JSON_STR=$(jq -n --arg prompt "$PROMPT" --arg model "$MODEL_NAME" --arg n "1" --arg size "1024x1024" \
  '{
    model: $model,
    prompt: $prompt,
    n: ($n | tonumber),
    size: $size
  }')

# デバッグ用に生成されたJSON_STRを表示
echo "$JSON_STR"

# curlでリクエストを送信
curl https://api.openai.com/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d "$JSON_STR" -o $JSON_FILE_PATH

# 画像のurlを安全に取得
IMAGE_URL=$(jq -r 'try .data[0].url // empty' ${JSON_FILE_PATH})

if [[ -n "$IMAGE_URL" ]]; then
  echo "$IMAGE_URL"
  # 画像をダウンロード
  curl -o ${OUTPUT_IMAGE_FILE_PATH} "${IMAGE_URL}"
else
  echo "url not found."
  cat $JSON_FILE_PATH
fi


