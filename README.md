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


## tree

`tree -Fd --filesfirst -I ".git/|.xdevkit/|*.swp|rabbitmq|xdevkit-movie-maker|data|aivisspeech"`

```
.
├── app テスト用
│   └── test
│       └── asset
├── service マイクロサービス docker-compose.ymlのサービス名と一致
│   ├── chatgpt OpenAI APIへの問い合わせを管理 ストーリー作成、画像作成、ナレーションcsv修正 ただし音声合成は除く
│   │   ├── docker Dockerfileがある。imageはnode:20-slim
│   │   └── src
│   │       ├── lib OpenAI APIへの問い合わせシェルスクリプトを4種格納
│   │       └── node_modules
│   ├── movieApi
│   │   ├── docker Dockerfileがある。imageはnode:20-slim
│   │   └── src
│   │       ├── action app.jsから呼び出されるリクエストハンドラ
│   │       ├── core actionが使用するビジネスロジック
│   │       ├── input アプリへの入力データハンドラ
│   │       ├── node_modules
│   │       ├── output アプリからの出力データハンドラ
│   │       └── view ブラウザ側コード
│   │           └── static
│   └── movieEngine
│       ├── docker Dockerfileがある。imageはnvidia/cuda:11.8.0-devel-ubuntu22.04。gpuを使ってffmpegを高速化
│       └── src
│           ├── lib
│           └── node_modules
└── setting .envで環境ごとのコンテナ名を管理
```

