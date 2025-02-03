# 絵本動画をChatGPTで自動生成するWebアプリ  

## 概要

Webページのフォームに物語のテーマと対象ユーザを入力すると、絵本動画が作成される。  
  
## 成果物  
[Webサイト https://reiwa.co](https://reiwa.co)  
[発表スライド](https://reiwa.co/slide.html)  


## 処理の流れ

```
URLでアクセスすると、WebサーバがWebブラウザにWebページを返す。
フォームにテーマとターゲットを入力すると、Webサーバに動画作成リクエスト送信。
動画作成リクエストを受け、Webサーバは文章生成AIに文章を生成させる。(具体的には、ChatGPTまたはAzureAIのgpt-4oのAPIに物語作成の指示を渡す。)
その結果、物語、ナレーションの台本、その挿絵の描写を得る。
Webサーバは、画像生成AIに画像を生成させる。(具体的には、ChatGPTまたはAzureAIのDALL-E-3のAPIに挿絵の描写を渡す。)
音声ライブラリに、音声ファイルを作成させる。(具体的には、voicevoxに生成されたナレーションの台本を渡す。）
動画ライブラリに、動画ファイルを作成させる。(具体的には、生成された画像と、作成した音声を渡す。ffmpegとImageMagickがフェードイン、字幕表示、音声と動画の結合を行う。)
Webサーバは、上記の処理の間はステータスを監視している。
Webブラウザは、ステータスが変わったかどうかを定期的にWebサーバにリクエストする。
ステータスが「動画作成完了」に代わったら、Webブラウザは動画をWebサーバから取得して表示する。
```

## コアモジュール  
[xdevkit-movie-maker](https://github.com/autoaim-jp/xdevkit-movie-maker)  
  
## 関連リポジトリ  
[chatgpt-rabbitmq ChatGPT APIの利用](https://github.com/autoaim-jp/chatgpt-rabbitmq)  
[movie-rabbitmq テキストで動画生成](https://github.com/autoaim-jp/movie-rabbitmq)  

  
## 技術スタック
### インフラ
Docker, Docker Compose, Makefile  

### デプロイ関連
Git, Git Submodule, GitHub, Markdown  
Ubuntu, nginx, VPN  

### バックエンド
Node.js, Express.js  
RabbitMQ, AMQP  
FFmpeg, ImageMagick, Bash   

### フロントエンド
HTML, CSS, JavaScript, Tailwind CSS, Alpine.js  

### API
ChatGPT (OpenAI API), Azure AI, VOICEVOX  


### tree

`tree -Fa --filesfirst -I ".git/|.xdevkit/|*.swp|rabbitmq|xdevkit-movie-maker|data|aivisspeech"`

```
./
├── .dockerignore
├── .gitignore
├── .gitmodules
├── Makefile
├── README.md
├── docker-compose.yml
├── .github/
│   └── workflows/
│       └── chatgpt-code-review.yml
├── app/
│   └── test/
│       ├── curl_get_content.sh*
│       ├── curl_get_latest.sh*
│       ├── curl_get_list.sh*
│       ├── curl_get_lookup_chatgpt.sh*
│       ├── curl_get_lookup_file.sh*
│       ├── curl_post_chatgpt.sh*
│       ├── curl_post_dummy.sh*
│       ├── curl_post_image.sh*
│       ├── curl_post_main.sh*
│       ├── curl_post_ping.sh*
│       ├── curl_post_story.sh*
│       └── asset/
│           ├── dummy_image0.png
│           ├── dummy_image1.png
│           ├── dummy_image2.png
│           ├── dummy_image3.png
│           ├── dummy_image4.png
│           ├── narration.csv
│           └── prompt.txt
├── service/
│   ├── chatgpt/
│   │   ├── docker/
│   │   │   └── Dockerfile
│   │   └── src/
│   │       ├── .env
│   │       ├── .env.sample
│   │       ├── app.js
│   │       ├── core.js
│   │       ├── input.js
│   │       ├── lib.js
│   │       ├── output.js
│   │       ├── package.json
│   │       ├── setting.js
│   │       ├── lib/
│   │       │   ├── azureai_image.sh*
│   │       │   ├── azureai_text.sh*
│   │       │   ├── openai_image.sh*
│   │       │   └── openai_text.sh*
│   │       └── node_modules/
│   ├── movieApi/
│   │   ├── docker/
│   │   │   └── Dockerfile
│   │   └── src/
│   │       ├── .env
│   │       ├── .env.sample
│   │       ├── action.js
│   │       ├── app.js
│   │       ├── core.js
│   │       ├── input.js
│   │       ├── lib.js
│   │       ├── output.js
│   │       ├── package.json
│   │       ├── setting.js
│   │       ├── yarn.lock
│   │       ├── action/
│   │       │   ├── getHandlerFileContent.js
│   │       │   ├── getHandlerFileList.js
│   │       │   ├── getHandlerFileListUpload.js
│   │       │   ├── getHandlerFileUpload.js
│   │       │   ├── getHandlerLatestFileList.js
│   │       │   ├── getHandlerLookupChatgptResponse.js
│   │       │   ├── getHandlerLookupResponse.js
│   │       │   ├── getHandlerRegisterChatPrompt.js
│   │       │   ├── getHandlerRegisterDummyPrompt.js
│   │       │   ├── getHandlerRegisterImagePrompt.js
│   │       │   ├── getHandlerRegisterMainPrompt.js
│   │       │   ├── getHandlerRegisterPingPrompt.js
│   │       │   ├── getHandlerRegisterPrompt.js
│   │       │   └── getHandlerRegisterStoryPrompt.js
│   │       ├── core/
│   │       │   ├── handleFileContent.js
│   │       │   ├── handleFileList.js
│   │       │   ├── handleLatestFileList.js
│   │       │   ├── handleLookupChatgptResponse.js
│   │       │   ├── handleLookupResponse.js
│   │       │   ├── handleRegisterChatPrompt.js
│   │       │   ├── handleRegisterDummyPrompt.js
│   │       │   ├── handleRegisterImagePrompt.js
│   │       │   ├── handleRegisterMainPrompt.js
│   │       │   ├── handleRegisterPingPrompt.js
│   │       │   ├── handleRegisterPrompt.js
│   │       │   ├── handleRegisterStoryPrompt.js
│   │       │   ├── init.js
│   │       │   ├── startConsumer.js
│   │       │   └── startGenerateImageAndMovie.js
│   │       ├── input/
│   │       │   ├── getFileContent.js
│   │       │   ├── getFileDirList.js
│   │       │   ├── getFileDirListWithTitle.js
│   │       │   ├── getLatestFileList.js
│   │       │   └── init.js
│   │       ├── lib/
│   │       │   └── dalle3/
│   │       │       └── generate.sh*
│   │       ├── node_modules/
│   │       ├── output/
│   │       │   ├── copyFile.js
│   │       │   ├── init.js
│   │       │   ├── makeDir.js
│   │       │   └── saveFile.js
│   │       └── view/
│   │           └── static/
│   │               ├── favicon.png
│   │               ├── favicon.webp
│   │               ├── hackathon.html
│   │               ├── index.html
│   │               ├── logo.png
│   │               ├── narration_studio.png
│   │               ├── narrator.html
│   │               ├── narrator2.html
│   │               ├── slide.html
│   │               └── audio/
│   │                   ├── gen.sh*
│   │                   ├── query.json
│   │                   ├── test1.wav
│   │                   ├── test2.wav
│   │                   ├── test3.wav
│   │                   ├── test4.wav
│   │                   ├── test5.wav
│   │                   ├── test6.wav
│   │                   ├── test7.wav
│   │                   └── test8.wav
│   └── movieEngine/
│       ├── docker/
│       │   └── Dockerfile
│       └── src/
│           ├── .env
│           ├── .env.sample
│           ├── app.js
│           ├── core.js
│           ├── input.js
│           ├── lib.js
│           ├── output.js
│           ├── package.json
│           ├── setting.js
│           ├── lib/
│           └── node_modules/
└── setting/
    ├── .env
    ├── .env.sample
    └── version.conf

30 directories, 122 files
```

