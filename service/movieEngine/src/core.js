const mod = {}
const store = {}

const init = async ({ setting, output, input, lib, amqpConnection }) => {
  const amqpPromptChannel = await amqpConnection.createChannel()
  mod.amqpPromptChannel = amqpPromptChannel
  const amqpResponseChannel = await amqpConnection.createChannel()
  mod.amqpResponseChannel = amqpResponseChannel

  mod.setting = setting
  mod.output = output
  mod.input = input
  mod.lib = lib
}

const _callMainDummy = async () => {
  const outputFilePath = '/app/data/output_file.mp4'
  const resultList = []
  const commandList = ['cd', '/app/lib/xdevkit-movie-maker', '&&', './main_dummy.sh', outputFilePath]

  await mod.lib.fork({ commandList, resultList })

  mod.output.saveFile({ filePath: '/app/data/fork3.log', fileBuffer: Buffer.from(resultList.join('\n')) })

  const resultMovieBuffer = mod.input.readFile({ filePath: outputFilePath })

  return resultMovieBuffer
}

const _callMain = async ({ requestId, titleBuffer, narrationCsvBuffer, imageBufferList }) => {
  const narrationCsvFilePath = `/app/data/${requestId}/narration.csv`
  const outputFilePath = `/app/data/${requestId}/output_file.mp4`
  const IMAGE_EXT = '.png'
  const TEAM_NAME = '"Tempra\nTitans"'
  const VOICE_ENGINE = 'voicevox'

  const requestDirPath = `/app/data/${requestId}/`
  mod.output.makeDir({ dirPath: requestDirPath })
  const title = titleBuffer.toString()
  mod.output.saveFile({ filePath: narrationCsvFilePath, fileBuffer: narrationCsvBuffer })
  const titleImageFilePath = `${requestDirPath}title${IMAGE_EXT}`
  mod.output.saveFile({ filePath: titleImageFilePath, fileBuffer: imageBufferList[0] })

  const imageDirPath = `${requestDirPath}image/`
  mod.output.makeDir({ dirPath: imageDirPath })

  imageBufferList.forEach((fileBuffer, i) => {
    // 0 is title image
    if(i === 0 || fileBuffer === null) {
      return
    }
    const filePath = `${imageDirPath}${i}${IMAGE_EXT}`
    mod.output.saveFile({ filePath, fileBuffer })
  })
  const resultList = []

  const commandList = ['cd', '/app/lib/xdevkit-movie-maker', '&&', './main.sh', outputFilePath, narrationCsvFilePath, title, titleImageFilePath, TEAM_NAME, imageDirPath, VOICE_ENGINE]

  console.log({ commandList })
  await mod.lib.fork({ commandList, resultList })

  mod.output.saveFile({ filePath: '/app/data/fork3.log', fileBuffer: Buffer.from(resultList.join('\n')) })

  const resultMovieBuffer = mod.input.readFile({ filePath: outputFilePath })

  return resultMovieBuffer
}

const _callPart1 = async ({ requestId, narrationCsvBuffer }) => {
  const narrationCsvFilePath = `/app/data/${requestId}/narration.csv`
  const VOICE_ENGINE = 'voicevox'

  const requestDirPath = `/app/data/${requestId}/`
  const imageDirPath = `${requestDirPath}image/`
  mod.output.makeDir({ dirPath: imageDirPath })
  mod.output.saveFile({ filePath: narrationCsvFilePath, fileBuffer: narrationCsvBuffer })

  // 音声と２つのcsvファイルを作成
  const part1ResultList = []
  const soundFilePath = `/app/data/${requestId}/sound.wav`
  const subtitleFilePath = `/app/data/${requestId}/subtitle.csv`
  const imageListFilePath = `/app/data/${requestId}/image_list.csv`
  const fast1CommandList = ['cd', '/app/lib/xdevkit-movie-maker', '&&', './fast_part1.sh', soundFilePath, subtitleFilePath, imageListFilePath, imageDirPath, narrationCsvFilePath, VOICE_ENGINE]

  console.log({ fast1CommandList })
  await mod.lib.fork({ commandList: fast1CommandList, resultList: part1ResultList })

  mod.output.saveFile({ filePath: '/app/data/fork_fast_part1.log', fileBuffer: Buffer.from(part1ResultList.join('\n')) })

  // 画像が送られてくるまで待つ
  while (!store[requestId]?.isReady) {
    await mod.lib.awaitSleep({ ms: 0.1 * 1000 })
  }

  const part2ResultList = []
  const title = store[requestId].title
  const outputFilePath = `/app/data/${requestId}/output_file.mp4`
  const TITLE_SEC = 6
  const TEAM_TELOP_IMAGE_FILE_PATH = '/app/lib/xdevkit-movie-maker/asset/src/project/fast/telop.png'
  const ENDING_MOVIE_INDEX = -1
  const IMAGE_EXT = '.png'
  const titleImageFilePath = `${requestDirPath}title${IMAGE_EXT}`
  const fast2CommandList = ['cd', '/app/lib/xdevkit-movie-maker', '&&', './fast_part2.sh', outputFilePath, soundFilePath, subtitleFilePath, imageListFilePath, imageDirPath, title, titleImageFilePath, TITLE_SEC, TEAM_TELOP_IMAGE_FILE_PATH, ENDING_MOVIE_INDEX]

  console.log({ fast2CommandList })
  await mod.lib.fork({ commandList: fast2CommandList, resultList: part2ResultList })

  mod.output.saveFile({ filePath: '/app/data/fork_fast_part2.log', fileBuffer: Buffer.from(part2ResultList.join('\n')) })

  const resultMovieBuffer = mod.input.readFile({ filePath: outputFilePath })

  return resultMovieBuffer
}

const _part2Ready = ({ requestId, titleBuffer, imageBufferList }) => {
  const requestDirPath = `/app/data/${requestId}/`
  const imageDirPath = `${requestDirPath}image/`
  const IMAGE_EXT = '.png'
  const title = titleBuffer.toString()
  const titleImageFilePath = `${requestDirPath}title${IMAGE_EXT}`
  mod.output.saveFile({ filePath: titleImageFilePath, fileBuffer: imageBufferList[0] })

  imageBufferList.forEach((fileBuffer, i) => {
    // 0 is title image
    if(i === 0 || fileBuffer === null) {
      return
    }
    const filePath = `${imageDirPath}${i}${IMAGE_EXT}`
    mod.output.saveFile({ filePath, fileBuffer })
  })
 
  store[requestId] = { isReady: true, title, }
}

const handleRequest = async ({ requestBuffer }) => {
  const delimiterDelimiterBuffer = Buffer.from('|')
  const splitResultList = mod.lib.parseBufferList({ buffer: requestBuffer, delimiterDelimiterBuffer })
  // console.log({ splitResultList })
  const responseBufferList = []
  const tmpFilePath = '/app/data/uploaded_file'

  const requestType = splitResultList[0].toString()
  const requestId = splitResultList[1].toString()

  console.log({ requestType, requestId })

  if (requestType === 'ping') {
    const fileBuffer = splitResultList[2]
    const saveResult = mod.output.saveFile({ filePath: tmpFilePath, fileBuffer })
    // console.log({ saveResult })
    responseBufferList.push(Buffer.from(requestType))
    responseBufferList.push(Buffer.from('pong'))
  } else if (requestType === 'main_dummy') {
    const resultMovieBuffer = await _callMainDummy()
    responseBufferList.push(Buffer.from(requestType))
    responseBufferList.push(Buffer.from('success'))
  } else if (requestType === 'main') {
    const titleBuffer = splitResultList[2]
    const narrationCsvBuffer = splitResultList[3]
    const imageBufferList = splitResultList.slice(4)
    const resultMovieBuffer = await _callMain({ requestId, titleBuffer, narrationCsvBuffer, imageBufferList })
    responseBufferList.push(Buffer.from(requestType))
    responseBufferList.push(resultMovieBuffer)
  } else if (requestType === 'part1') {
    const narrationCsvBuffer = splitResultList[2]
    const resultMovieBuffer = await _callPart1({ requestId, narrationCsvBuffer })
    responseBufferList.push(Buffer.from(requestType))
    responseBufferList.push(resultMovieBuffer)
  } else if (requestType === 'part2') {
    const titleBuffer = splitResultList[2]
    const imageBufferList = splitResultList.slice(3)
    await _part2Ready({ requestId, titleBuffer, imageBufferList })
  } else {
    console.log('invalid requestType:', requestType)
  }

  return { requestId: requestId, responseBufferList }
}

const _createResponseBuffer = ({ requestId, responseBufferList }) => {
  const currentDelimiter = Buffer.from(mod.lib.getUlid())
  const delimiterDelimiter = Buffer.from('|')
  let messageBuffer = Buffer.concat([
    currentDelimiter,
    delimiterDelimiter,
    Buffer.from(requestId),
  ])

  responseBufferList.forEach((buffer) => {
    messageBuffer = Buffer.concat([
      messageBuffer,
      currentDelimiter,
      buffer,
    ])
  })

  messageBuffer = Buffer.concat([
    messageBuffer,
    currentDelimiter,
  ])

  return messageBuffer
}

const startConsumer = async () => {
  const promptQueue = mod.setting.getValue('amqp.REQUEST_QUEUE') 
  await mod.amqpPromptChannel.assertQueue(promptQueue)

  const responseQueue = mod.setting.getValue('amqp.RESPONSE_QUEUE') 
  await mod.amqpResponseChannel.assertQueue(responseQueue)

  mod.amqpPromptChannel.consume(promptQueue, async (msg) => {
    if (msg !== null) {
      // console.log('Recieved:', msg.content.toString())
      const SLEEP_MS = mod.setting.getValue('movie.SLEEP_MS')
      // console.log(`sleep ${SLEEP_MS}s`)
      await mod.lib.awaitSleep({ ms: SLEEP_MS })

      const requestBuffer = msg.content

      const { requestId, responseBufferList } = await handleRequest({ requestBuffer })
      console.log('movie response:', responseBufferList.length)

      if(responseBufferList.length !== 0) {
        const responseBuffer = _createResponseBuffer({ requestId, responseBufferList })
        mod.amqpResponseChannel.sendToQueue(responseQueue, responseBuffer)
      }

      mod.amqpPromptChannel.ack(msg)
    } else {
      console.log('Consumer cancelled by server')
      throw new Error()
    }
  })
}

export default {
  init,
  startConsumer,
}

