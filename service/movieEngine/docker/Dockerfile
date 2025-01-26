# CUDA + Ubuntu のイメージをベースにする (一例: 11.8-devel / Ubuntu 22.04)
FROM nvidia/cuda:11.8.0-devel-ubuntu22.04

# Node.js 20 をインストール
RUN apt-get update && apt-get install -y curl gnupg2
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

# FFmpeg (NVENC 対応) ビルドに必要なパッケージをインストール
RUN apt-get install -y \
    git \
    build-essential \
    pkg-config \
    yasm \
    cmake \
    libfdk-aac-dev \
    imagemagick \
    sox \
    libsox-fmt-all \
    jq \
    bc \
    && rm -rf /var/lib/apt/lists/*

# FFmpeg ソースをダウンロード
WORKDIR /tmp
RUN git clone --depth 1 --branch release/6.0 https://github.com/FFmpeg/FFmpeg.git ffmpeg

# FFmpeg を NVENC 有効でビルド
WORKDIR /tmp/ffmpeg
RUN ./configure \
    --enable-cuda-nvcc \
    --enable-nvenc \
    --enable-nonfree \
    --enable-libfdk-aac \
    --enable-gpl \
    --extra-cflags=-I/usr/local/cuda/include \
    --extra-ldflags=-L/usr/local/cuda/lib64 \
    --prefix=/usr/local \
    && make -j"$(nproc)" \
    && make install \
    && ldconfig

# アプリ用ディレクトリを作成
WORKDIR /app

# package.json をコピーして依存関係をインストール
COPY ./service/movieEngine/src/package.json /app/
RUN yarn install

# Node.js ソースをコピー
COPY ./service/movieEngine/src /app

# CMD ["yarn", "run", "start"]

