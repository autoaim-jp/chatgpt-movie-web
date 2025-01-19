const setting = {}

const init = ({ env }) => {
  setting.env = {}
  setting.env.SERVER_PORT = env.SERVER_PORT

  setting.env.AMQP_USER = env.AMQP_USER
  setting.env.AMQP_PASS = env.AMQP_PASS
  setting.env.AMQP_HOST = env.AMQP_HOST
  setting.env.AMQP_PORT = env.AMQP_PORT
}

setting.path = {}
setting.path.PUBLIC_STATIC_DIR = 'view/static'
setting.path.MOVIE_DIR_PATH = '/app/data/output/'
setting.path.DEFAULT_IMAGE_FILE_PATH = 'test/image_curltest.png'

setting.amqp = {}
setting.amqp.REQUEST_QUEUE = 'movie-request-queue'
setting.amqp.RESPONSE_QUEUE = 'movie-response-queue'
// chatgpt
setting.amqp.CHATGPT_PROMPT_QUEUE = 'chatgpt-prompt-queue'
setting.amqp.CHATGPT_RESPONSE_QUEUE = 'chatgpt-response-queue'

setting.key = {}
setting.key.FORM_UPLOAD = 'file'
setting.key.FILE_LIST_UPLOAD = 'fileList[]'

setting.api = {}
const API_ROOT_PATH = '/api/v1'
setting.api.REGISTER_PROMPT_PING = `${API_ROOT_PATH}/prompt/register/ping`
setting.api.REGISTER_PROMPT_DUMMY = `${API_ROOT_PATH}/prompt/register/dummy`
setting.api.REGISTER_PROMPT_MAIN = `${API_ROOT_PATH}/prompt/register/main`
setting.api.LOOKUP_RESPONSE = `${API_ROOT_PATH}/file/response/lookup`
setting.api.GET_FILE_LIST = `${API_ROOT_PATH}/file/list`
setting.api.GET_LATEST_FILE_LIST = `${API_ROOT_PATH}/file/latest`
setting.api.GET_FILE_CONTENT = `${API_ROOT_PATH}/file/content`

// chatgpt
setting.api.REGISTER_PROMPT = `${API_ROOT_PATH}/prompt/register/chatgpt`
setting.api.LOOKUP_CHATGPT_RESPONSE = `${API_ROOT_PATH}/chatgpt/response/lookup`
setting.api.REGISTER_STORY_PROMPT = `${API_ROOT_PATH}/prompt/register/story`
setting.api.REGISTER_CHAT_PROMPT = `${API_ROOT_PATH}/prompt/register/chat`
setting.api.REGISTER_IMAGE_PROMPT = `${API_ROOT_PATH}/prompt/register/image`

setting.prompt = {}
setting.prompt.IMAGE_TEST = '海、山、革、鳥、チーター、コアラ、猫'
setting.prompt.STORY_VER1 = `【物語の要望】に従って、絵本に使う【物語】を作成してください。その後、【物語の要望】【物語】【固定設定の要望】に従って【固定設定】を整理してください。さらに、【ナレーションcsvのルール】に従い、【ナレーションcsvの例】を参考に、【物語】を【ナレーションcsv】に変換して表示してください。最後に、【物語の要望】【物語】【条件】【固定設定】に従って、【画像生成プロンプトの例】を参考に、絵本の表紙と各ページごとに画像を表示するための【画像生成プロンプト】を作成してください。全体を通して、【前提】は守ってください。
改めて整理すると、生成してほしいのは以下の4つです。
【物語】【固定設定】【ナレーションcsv】【画像生成プロンプト】


【物語の要望】
以下の設定で短い物語を作成してください。
    テーマ:  __THEME_TEXT__
    ターゲット: __TARGET_TEXT__
    ページ数: 4ページ
　各ページ内の最大文字数: 200文字
　イラストの基本スタイル: 白黒、線画
　最終ページの内容: 教訓が得られるような終わり方。不幸ではない終わり方。
　最後のひとこと: おしまい。で締める。

物語の出力形式:
　　タイトル: <物語のタイトル>
　　ページ1: <ページ1のタイトル>
　　<ページ1の内容>
　　(省略)
　　ページn: <ページnのタイトル>
　　<ページnの内容>


【固定設定の要望】
    登場人物の固定設定は具体的に。（人間または動物、名前、容姿、服装、性格など。容姿は、輪郭、目の色、髪の色、髪が何cmか、肌の色、身長と体重、体型など、大きさの数値と白か黒かを詳細に決めてください。服装は、防止の有無とその色、衣類の種類、色、装飾品など、大きさの数値と白色か黒色かを詳細に決めてください。その他も詳細に決めてください。上半身の服は無地です。）
    物語の舞台は詳細を明確に。（背景や環境。建物や構造物の高さと色も具体的な数字で出してください。構造物は、窓の数など詳細なデザインも必要です。）

固定設定の出力形式:
　　登場人物の数: m
        登場人物1: 人間または動物の名前、名前、年齢、性別、体型、髪型・髪色、服装、帽子、持ち物、その他特徴。
　　(省略)
　　登場人物m: [同様に詳細に記載]
        場所: 背景の色味、主な特徴（例: 木製の机、青い空、緑の木々）。
　　その他の条件: 強弱がある白黒の線画


【ナレーションcsvのルール】
# ファイルの、最初の行と最後の行は# ===を表示
# まず最初はengine,voicevox,,を表示
# タイトルはsilent,1,,とsilent,3,,の行で挟む
# 各ページの最初はstart-page,,,の行
# 文章は句点や鍵括弧ごとに行を分ける。その後、各文章の先頭にspeak,話し手ID,読み上げのスピード,をつける。
# 話し手ID: ナレーターはn、女性の登場人物の発言ならばf1、男性の登場人物の発言ならばm1。
# 読み上げのスピード: 1.0が基本。早くするなら最大1.25。遅くするなら最低で0.75。
# 各文章のあとはsilent,1,,の行
# 各ページの最後はend-page,,,の行、その後にsilent,3,,の行

【ナレーションcsvの例】
# ===
engine,voicevox,,
# タイトル
silent,1,,
speak,f1,1.0,森の冒険者、タケルと、ふしぎなタネ。
silent,3,,

# ページ1: 出発
start-page,,,
speak,f1,1.0,森が大好きなタケルは、不思議なタネを見つけました。
silent,1,,
speak,m1,1.0,「植えたらすごい植物が育つかも！」
silent,1,,
speak,f1,1.0,ワクワクしながら家に帰ろうとしますが、急いで走って道に迷ってしまいます。
end-page,,,
silent,3,,

# 2ページ目: 森の教え
start-page,,,
speak,f1,1.0,タケルが困っていると、森の大きな木が話しかけてきました。

# (中略)

end-page,,,
silent,3,,
# ===

【画像生成プロンプトの例】
title page: Create an image...
page1: Create an image...

【前提】
物語は起承転結を意識してください。
画像生成はDALL-E 3を使います。画像生成プロンプトはそれぞれ、800文字以内にしてください。
画像生成のプロンプトには、文字を絶対に表示しないことを明記してください。
画像生成プロンプトは、以下のsafetyシステムのエラーが出ないような内容にしてください。
safetyシステムのエラー: Your request was rejected as a result of our safety system. Your prompt may contain text that is not allowed by our safety system.
`

setting.prompt.STORY_VER2 = `【物語の要望】と【ユーザ要望】に従って、絵本に使う【物語】を作成してください。その後、【物語の要望】【物語】【固定設定の要望】に従って【固定設定】を整理してください。さらに、【ナレーションcsvのルール】に従い、【ナレーションcsvの例】を参考に、【物語】を【ナレーションcsv】に変換して表示してください。最後に、【物語の要望】【ユーザ要望】【物語】【条件】【固定設定】に従って、【画像生成プロンプトの例】を参考に、絵本の表紙と各ページごとに画像を表示するための【画像生成プロンプト】を作成してください。全体を通して、【前提】は守ってください。
改めて整理すると、生成してほしいのは以下の4つです。
【物語】【固定設定】【ナレーションcsv】【画像生成プロンプト】


【物語の要望】
以下の設定で短い物語を作成してください。ただし、ユーザ要望で指定があれば上書きしてください。
    テーマ: ビジネス系
    ターゲット: 20代〜30代の会社員
    ページ数: 4ページ
　各ページ内の最大文字数: 500文字
　イラストの基本スタイル: 白黒、線画
　各ページの内容: ナレーターが1〜2の文章を読み上げ。男と女が1〜2の文章で会話。

　物語の出力形式:
　　タイトル: <物語のタイトル>
　　ページ1: <ページ1のタイトル>
　　<ページ1の内容>
　　(省略)
　　ページn: <ページnのタイトル>
　　<ページnの内容>

【ユーザ要望】
__THEME_TEXT__


【固定設定の要望】
    登場人物の固定設定は具体的に。（人間または動物、名前、容姿、服装、性格など。容姿は、輪郭、目の色、髪の色、髪が何cmか、肌の色、身長と体重、体型など、大きさの数値と白か黒かを詳細に決めてください。服装は、防止の有無とその色、衣類の種類、色、装飾品など、大きさの数値と白色か黒色かを詳細に決めてください。その他も詳細に決めてください。上半身の服は無地です。）
    物語の舞台は詳細を明確に。（背景や環境。建物や構造物の高さと色も具体的な数字で出してください。構造物は、窓の数など詳細なデザインも必要です。）

固定設定の出力形式:
　　登場人物の数: m
        登場人物1: 人間または動物の名前、名前、年齢、性別、体型、髪型・髪色、服装、帽子、持ち物、その他特徴。
　　(省略)
　　登場人物m: [同様に詳細に記載]
        場所: 背景の色味、主な特徴（例: 木製の机、青い空、緑の木々）。
　　その他の条件: 強弱がある白黒の線画


【ナレーションcsvのルール】
# ファイルの、最初の行と最後の行は# ===を表示
# まず最初はengine,voicevox,,を表示
# タイトルはsilent,1,,とsilent,3,,の行で挟む
# 各ページの最初はstart-page,,,の行
# 文章は句点や鍵括弧ごとに行を分ける。その後、各文章の先頭にspeak,話し手ID,読み上げのスピード,をつける。
# 話し手ID: ナレーターはn、登場人物の中で1人目の女性の発言ならばf1、登場人物の中で2人目の男性の発言ならばm2のような規則。n、f1〜f3、m1〜m3が利用可能。
# 読み上げのスピード: 1.0が基本。早くするなら最大1.25。遅くするなら最低で0.75。
# 各文章のあとはsilent,1,,の行
# 各ページの最後はend-page,,,の行、その後にsilent,3,,の行

【ナレーションcsvの例】
# ===
engine,voicevox,,
# タイトル
silent,1,,
speak,f1,1.0,森の冒険者、タケルと、ふしぎなタネ。
silent,3,,

# ページ1: 出発
start-page,,,
speak,f1,1.0,森が大好きなタケルは、不思議なタネを見つけました。
silent,1,,
speak,m1,1.0,「植えたらすごい植物が育つかも！」
silent,1,,
speak,f1,1.0,ワクワクしながら家に帰ろうとしますが、急いで走って道に迷ってしまいます。
end-page,,,
silent,3,,

# 2ページ目: 森の教え
start-page,,,
speak,f1,1.0,タケルが困っていると、森の大きな木が話しかけてきました。

# (中略)

end-page,,,
silent,3,,
# ===

【画像生成プロンプトの例】
title page: Create an image...
page1: Create an image...


【前提】
物語は起承転結を意識してください。
画像生成はDALL-E 3を使います。画像生成プロンプトはそれぞれ、800文字以内にしてください。
画像生成のプロンプトには、文字を絶対に表示しないことを明記してください。
画像生成プロンプトは、以下のsafetyシステムのエラーが出ないような内容にしてください。
safetyシステムのエラー: Your request was rejected as a result of our safety system. Your prompt may contain text that is not allowed by our safety system.
`
const getList = (...keyList) => {
  /* eslint-disable no-param-reassign */
  const constantList = keyList.reduce((prev, key) => {
    let value = setting
    for (const keySplit of key.split('.')) {
      value = value[keySplit]
    }
    prev[key.slice(key.lastIndexOf('.') + 1)] = value
    return prev
  }, {})
  for (const key of keyList) {
    if (constantList[key.slice(key.lastIndexOf('.') + 1)] === undefined) {
      throw new Error(`[error] undefined setting constant: ${key}`)
    }
  }
  return constantList
}


const getValue = (key) => {
  let value = setting
  for (const keySplit of key.split('.')) {
    value = value[keySplit]
  }
  return value
}

export default {
  init,
  getList,
  getValue,
}

