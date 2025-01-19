import { mod, store } from './init.js'
export default {}

export const startGenerateImageAndMovie = async ({ requestId, title, themeText, targetText, prompt, chatgptResponse, narrationCsv, imagePromptList }) => {
  const OPENAI_CHATGPT_API_KEY = mod.setting.getValue('env.OPENAI_CHATGPT_API_KEY')
  const MOVIE_DIR_PATH = mod.setting.getValue('path.MOVIE_DIR_PATH') 
  const IMAGE_EXT = '.png'
  const dateStr = mod.lib.formatDate({ format: 'YYYYMMDD_hhmmss' })
  const dirPath = `${MOVIE_DIR_PATH}${requestId}/${dateStr}/`
  mod.output.makeDir({ dirPath, })
  const tmpJsonDirPath = `${dirPath}tmpJson/`
  mod.output.makeDir({ dirPath: tmpJsonDirPath, })
  const chatgptResultJsonFilePath = `${dirPath}chatgpt_result_json.txt`
  mod.output.saveFile({ filePath: chatgptResultJsonFilePath, fileBuffer: Buffer.from(JSON.stringify({ requestId, title, themeText, targetText, prompt, chatgptResponse, narrationCsv, imagePromptList }, null, 2)) })

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

  await Promise.all(promiseList)

  const fileList = imageFilePathList.map((filePath) => {
    return { originalname: filePath, buffer: mod.input.getFileContent({ filePath }) }
  })
  const messageBuffer = mod.lib.getMainRequest({ requestId, fileList, title, narrationCsv })
  const queue = mod.setting.getValue('amqp.REQUEST_QUEUE') 
  mod.amqpChannel.sendToQueue(queue, messageBuffer)

  console.log('done: _startGenerateImageAndMovie', requestId, title)
}

