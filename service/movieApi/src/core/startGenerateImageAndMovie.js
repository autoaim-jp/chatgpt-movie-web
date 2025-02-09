import { mod, store } from './init.js'
export default {}

export const startGenerateImageAndMovie = async ({ requestId, title, themeText, targetText, prompt, chatgptResponse, narrationCsv, imagePromptList, resultFileName }) => {
  const OPENAI_CHATGPT_API_KEY = mod.setting.getValue('env.OPENAI_CHATGPT_API_KEY')
  const MOVIE_DIR_PATH = mod.setting.getValue('path.MOVIE_DIR_PATH') 
  const IMAGE_EXT = '.png'
  const dateStr = mod.lib.formatDate({ format: 'YYYYMMDD_hhmmss' })
  const dirPath = `${MOVIE_DIR_PATH}${requestId}/${dateStr}/`
  mod.output.makeDir({ dirPath, })
  const chatgptResultJsonFilePath = `${dirPath}${resultFileName}`
  mod.output.saveFile({ filePath: chatgptResultJsonFilePath, fileBuffer: Buffer.from(JSON.stringify({ requestId, title, themeText, prompt, chatgptResponse, narrationCsv, imagePromptList }, null, 2)) })
  const pathCompatibleForIndexPage = `${MOVIE_DIR_PATH}${requestId}/${resultFileName}`
  mod.output.copyFile({ filePathFrom: chatgptResultJsonFilePath, filePathTo: pathCompatibleForIndexPage })

  const chatgptQueue = mod.setting.getValue('amqp.CHATGPT_PROMPT_QUEUE') 
  await mod.amqpChannel.assertQueue(chatgptQueue)

  const imageFilePathList = []
  const promiseList = imagePromptList.map((imagePrompt, i) => {
    const fileName = `image_${i}${IMAGE_EXT}`
    const imageFilePath = `${dirPath}${fileName}`
    imageFilePathList.push(imageFilePath)

    const filePath = `${dateStr}/${fileName}`
    const _requestId = `${requestId}-${i}`
    const { buffer } = mod.lib.getImageRequest({ prompt: imagePrompt.replace(/"/g, ''), filePath, requestId: _requestId })
    mod.amqpChannel.sendToQueue(chatgptQueue, buffer)
    return new Promise((resolve) => {
      const waitChatgptResponseInterval = setInterval(() => {
        if(mod.input.getFileContent({ filePath: imageFilePath }) !== null) {
          clearInterval(waitChatgptResponseInterval)
          resolve()
        } else {
          console.log('checking...:', _requestId, fileName, imageFilePath, filePath)
        }
      }, 1 * 1000)
    })
  })


  const queue = mod.setting.getValue('amqp.REQUEST_QUEUE') 

  // 音声だけ先に作成
  const part1MessageBuffer = mod.lib.getPart1Request({ requestId, narrationCsv })
  mod.amqpChannel.sendToQueue(queue, part1MessageBuffer)

  // 画像を作成
  await Promise.all(promiseList)

  // 動画を作成
  const fileList = imageFilePathList.map((filePath) => {
    return { originalname: filePath, buffer: mod.input.getFileContent({ filePath }) }
  })
  const part2MessageBuffer = mod.lib.getPart2Request({ requestId, fileList, title })
  mod.amqpChannel.sendToQueue(queue, part2MessageBuffer)

  console.log('done: _startGenerateImageAndMovie', requestId, title)
}

