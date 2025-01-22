#!/bin/bash

VOICEVOX_SERVER="http://127.0.0.1:50021"

curl -X POST \
    "${VOICEVOX_SERVER}/audio_query" \
    -H "Content-Type: application/json" \
    -d '{
        "text": "失われた技術に、再び光を当てる。プロジェクトX、それは挑戦の物語。",
        "speaker": 2
    }' \
    | jq '.speedScale=0.9 | .pitchScale=-0.8 | .intonationScale=0.5 | .volumeScale=1.0 | .prePhonemeLength=0.1 | .postPhonemeLength=0.15' \
    > query.json


curl -X POST \
    "${VOICEVOX_SERVER}/synthesis" \
    -H "Content-Type: application/json" \
    -d @query.json \
    --output test8.wav

