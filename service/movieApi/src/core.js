const mod = {}
const store = {}

const init = async ({ setting, output, input, lib, amqpConnection }) => {
  const amqpChannel = await amqpConnection.createChannel()
  mod.amqpChannel = amqpChannel

  mod.setting = setting
  mod.output = output
  mod.input = input
  mod.lib = lib
}

const _getPingRequest = ({ requestId, fileBuffer, rightTopText, leftTopText, rightBottomText }) => {
  const requestType = 'ping'

  const currentDelimiter = Buffer.from(mod.lib.getUlid())
  const delimiterDelimiter = Buffer.from('|')
  const messageBuffer = Buffer.concat([
    currentDelimiter,
    delimiterDelimiter,
    Buffer.from(requestType),
    currentDelimiter,
    Buffer.from(requestId),
    currentDelimiter,
    Buffer.from(rightTopText),
    currentDelimiter,
    Buffer.from(leftTopText),
    currentDelimiter,
    Buffer.from(rightBottomText),
    currentDelimiter,
    fileBuffer, 
    currentDelimiter,
  ])

  return messageBuffer
}

const _getDummyRequest = ({ requestId }) => {
  const requestType = 'main_dummy'

  const currentDelimiter = Buffer.from(mod.lib.getUlid())
  const delimiterDelimiter = Buffer.from('|')
  const messageBuffer = Buffer.concat([
    currentDelimiter,
    delimiterDelimiter,
    Buffer.from(requestType),
    currentDelimiter,
    Buffer.from(requestId),
    currentDelimiter,
  ])

  return messageBuffer
}

const _getMainRequest = ({ requestId, fileList, title, narrationCsv }) => {
  const requestType = 'main'

  const currentDelimiter = Buffer.from(mod.lib.getUlid())
  console.log(`delimiter: ${currentDelimiter.toString()}`)
  const delimiterDelimiter = Buffer.from('|')
  let messageBuffer = Buffer.concat([
    currentDelimiter,
    delimiterDelimiter,
    Buffer.from(requestType),
    currentDelimiter,
    Buffer.from(requestId),
    currentDelimiter,
    Buffer.from(title),
    currentDelimiter,
    Buffer.from(narrationCsv),
  ])

  fileList.forEach((file) => {
    console.log({ originalname: file.originalname })
    messageBuffer = Buffer.concat([
      messageBuffer,
      currentDelimiter,
      file.buffer
    ])
  })

  messageBuffer = Buffer.concat([
    messageBuffer,
    currentDelimiter,
  ])

  return messageBuffer
}
const handleRegisterPingPrompt = async ({ fileBuffer, rightTopText, leftTopText, rightBottomText }) => {
  const queue = mod.setting.getValue('amqp.REQUEST_QUEUE') 
  await mod.amqpChannel.assertQueue(queue)

  const requestId = mod.lib.getUlid()
  const messageBuffer = _getPingRequest({ requestId, fileBuffer, rightTopText, leftTopText, rightBottomText })
  mod.amqpChannel.sendToQueue(queue, messageBuffer)

  const handleResult = { isRegistered: true, requestId }
  return handleResult
}

const handleRegisterDummyPrompt = async ({}) => {
  const queue = mod.setting.getValue('amqp.REQUEST_QUEUE') 
  await mod.amqpChannel.assertQueue(queue)

  const requestId = mod.lib.getUlid()
  const messageBuffer = _getDummyRequest({ requestId })
  mod.amqpChannel.sendToQueue(queue, messageBuffer)

  const handleResult = { isRegistered: true, requestId }
  return handleResult
}

const handleRegisterMainPrompt = async ({ fileList, title, narrationCsv }) => {
  const queue = mod.setting.getValue('amqp.REQUEST_QUEUE') 
  await mod.amqpChannel.assertQueue(queue)

  const requestId = mod.lib.getUlid()
  console.log({ requestId, title, narrationCsv })
  const messageBuffer = _getMainRequest({ requestId, fileList, title, narrationCsv })
  mod.amqpChannel.sendToQueue(queue, messageBuffer)

  const handleResult = { isRegistered: true, requestId }
  return handleResult
}


const handleLookupResponse = ({ requestId }) => {
  const handleResult = store[requestId]
  if (!handleResult) {
    return { status: 'waiting' }
  }

  return handleResult
}

const handleFileList = ({ requestId }) => {
  const MOVIE_DIR_PATH = mod.setting.getValue('path.MOVIE_DIR_PATH') 
  const dirPath = requestId? `${MOVIE_DIR_PATH}${requestId}/`: MOVIE_DIR_PATH
  console.log({ dirPath })
  const fileDirList = mod.input.getFileDirList({ dirPath })
  const handleResult = { result: { fileDirList } }
  return handleResult
}

const handleFileContent = ({ requestId, fileName }) => {
  const MOVIE_DIR_PATH = mod.setting.getValue('path.MOVIE_DIR_PATH') 
  const filePath = `${MOVIE_DIR_PATH}${requestId}/${fileName}`
  const handleResultBuffer = mod.input.getFileContent({ filePath })
  return handleResultBuffer
}

// chatgpt
const handleRegisterPrompt = async ({ prompt }) => {
  const queue = mod.setting.getValue('amqp.CHATGPT_PROMPT_QUEUE') 
  await mod.amqpChannel.assertQueue(queue)

  const requestId = mod.lib.getUlid()
  const requestObj = {
    requestId,
    prompt,
  }
  const requestObjStr = JSON.stringify(requestObj)

  mod.amqpChannel.sendToQueue(queue, Buffer.from(requestObjStr))

  const handleResult = { isRegistered: true, requestId }
  return handleResult
}

const handleLookupChatgptResponse = ({ requestId }) => {
  const handleResult = store[requestId]
  if (!handleResult) {
    return { status: 'waiting' }
  }

  return handleResult
}

// # ===\n で囲まれる部分を抽出
// ナレーションcsvを抽出
const extractBetweenTag = ({ str }) => {
  const regex = /# ===\n([\s\S]*?)# ===/
  const match = str.match(regex)
  return match ? match[1].trim() : ''
}

// 最後の5行から : のあとの部分を抽出
// タイトル画像と4ページの画像生成プロンプトを抽出
const extractLast5ColonPart = ({ str }) => {
  const lineList = str.split('\n').filter(line => line.includes(':'))
  const last5LineList = lineList.slice(-5)
  return last5LineList.map(line => line.split(':').slice(1).join(':').trim())
}

// 最初の : を含む行の処理
// タイトルを抽出
const extractFirstColonPart = ({ str }) => {
  const lines = str.split('\n')
  const firstColonLine = lines.find(line => line.includes(':'))
  return firstColonLine ? firstColonLine.split(':').slice(1).join(':').trim() : null
}

const _startGenerateImageAndMovie = async ({ requestId, title, themeText, targetText, prompt, chatgptResponse, narrationCsv, imagePromptList }) => {
  const OPENAI_CHATGPT_API_KEY = mod.setting.getValue('env.OPENAI_CHATGPT_API_KEY')
  const MOVIE_DIR_PATH = mod.setting.getValue('path.MOVIE_DIR_PATH') 
  const IMAGE_EXT = '.png'
  const dirPath = `${MOVIE_DIR_PATH}${requestId}/`
  mod.output.makeDir({ dirPath, })
  const tmpJsonDirPath = `${dirPath}tmpJson/`
  mod.output.makeDir({ dirPath: tmpJsonDirPath, })
  const chatgptResultJsonFilePath = `${dirPath}chatgpt_result_json.txt`
  mod.output.saveFile({ filePath: chatgptResultJsonFilePath, fileBuffer: Buffer.from(JSON.stringify({ requestId, title, themeText, targetText, prompt, chatgptResponse, narrationCsv, imagePromptList }, null, 2)) })

  const imageFilePathList = []
  const promiseList = imagePromptList.map((imagePrompt, i) => {
    const imageFilePath = `${dirPath}image_${i}${IMAGE_EXT}`
    imageFilePathList.push(imageFilePath)
    const tmpJsonFilePath = `${tmpJsonDirPath}${i}_json.txt`

    return new Promise((resolve) => {
      const resultList = []
      const commandList = ['/app/lib/dalle3/generate.sh', imageFilePath, tmpJsonFilePath, `"${OPENAI_CHATGPT_API_KEY}"`, `"${imagePrompt.replace(/"/g, '')}"`]

      mod.lib.fork({ commandList, resultList }).then(() => {
        resolve()
      })
    })
  })
  await Promise.all(promiseList)

  const fileList = imageFilePathList.map((filePath) => {
    return { originalname: filePath, buffer: mod.input.getFileContent({ filePath }) }
  })
  const messageBuffer = _getMainRequest({ requestId, fileList, title, narrationCsv })
  const queue = mod.setting.getValue('amqp.REQUEST_QUEUE') 
  mod.amqpChannel.sendToQueue(queue, messageBuffer)

  console.log('done: _startGenerateImageAndMovie', requestId, title)
}

const handleRegisterStoryPrompt = async ({ themeText, targetText }) => {
  const queue = mod.setting.getValue('amqp.CHATGPT_PROMPT_QUEUE') 
  const prompt = mod.setting.getValue('prompt.STORY_VER1')
    .replace(/__THEME_TEXT__/g, themeText)
    .replace(/__TARGET_TEXT__/g, targetText)

  await mod.amqpChannel.assertQueue(queue)

  const requestId = mod.lib.getUlid()
  const requestObj = {
    requestId,
    prompt,
  }
  const requestObjStr = JSON.stringify(requestObj)

  mod.amqpChannel.sendToQueue(queue, Buffer.from(requestObjStr))

  // wait response
  const waitChatgptResponseInterval = setInterval(() => {
    const result = store[requestId]
    if(result && result.status === 'creating-movie' && result.chatgpt !== undefined) {
      console.log('====================chatgptの結果')
      console.log(result.chatgpt)

      const narrationCsv = extractBetweenTag({ str: result.chatgpt })
      console.log('====================narrationCsvの結果')
      console.log(narrationCsv)

      const imagePromptList = extractLast5ColonPart({ str: result.chatgpt })
      console.log('====================imagePromptListの結果')
      console.log(imagePromptList)

      const title = extractFirstColonPart({ str: result.chatgpt })
      console.log('====================titleの結果')
      console.log(title)

      _startGenerateImageAndMovie({ requestId, title, themeText, targetText, prompt, chatgptResponse: result.chatgpt, narrationCsv, imagePromptList })

      clearInterval(waitChatgptResponseInterval)
    } else {
      console.log('checking...:', requestId)
    }
  }, 1 * 1000)

  const handleResult = { isRegistered: true, requestId }
  return handleResult
}


const startConsumer = async () => {
  const queue = mod.setting.getValue('amqp.RESPONSE_QUEUE') 
  const MOVIE_DIR_PATH = mod.setting.getValue('path.MOVIE_DIR_PATH') 
  await mod.amqpChannel.assertQueue(queue)

  mod.amqpChannel.consume(queue, (msg) => {
    if (msg !== null) {
      const responseBuffer = msg.content
      console.log('Recieved:', responseBuffer.length)
      mod.amqpChannel.ack(msg)
      const delimiterDelimiterBuffer = Buffer.from('|')
      const splitResultList = mod.lib.parseBufferList({ buffer: responseBuffer, delimiterDelimiterBuffer })

      const requestId = splitResultList[0].toString()
      const requestType = splitResultList[1].toString()

      const dirPath = `${MOVIE_DIR_PATH}${requestId}/`
      mod.output.makeDir({ dirPath, })
      if (requestType === 'main') {
        const filePath = `${dirPath}output.mp4`
        const fileBuffer = splitResultList[2]
        mod.output.saveFile({ filePath, fileBuffer })
        if (!store[requestId]) {
          store[requestId] = {}
        }
        store[requestId].status = 'complete'
      } else if (requestType === 'chatgpt') {
        // chatgpt
        const filePath = `${dirPath}story-by-chatgpt.txt`
        const chatgptResponseBuffer = splitResultList[2]
        mod.output.saveFile({ filePath, fileBuffer: chatgptResponseBuffer })
        if (!store[requestId]) {
          store[requestId] = {}
        }
        store[requestId].status = 'creating-movie'
        store[requestId].chatgpt = chatgptResponseBuffer.toString()
      } else {
        console.log(`invalid requestType: ${requestType}`)
      }
    } else {
      console.log('Consumer cancelled by server')
      throw new Error()
    }
  })
}

export default {
  init,
  handleRegisterPingPrompt,
  handleRegisterDummyPrompt,
  handleRegisterMainPrompt,
  handleFileList,
  handleFileContent,
  handleLookupResponse,
  handleRegisterPrompt,
  handleLookupChatgptResponse,
  handleRegisterStoryPrompt,
  startConsumer,
}

