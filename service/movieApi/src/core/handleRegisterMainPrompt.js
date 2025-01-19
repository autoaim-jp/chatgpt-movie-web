import { mod, store } from './init.js'
export default {}

export const handleRegisterMainPrompt = async ({ requestId, fileList, title, narrationCsv }) => {
  const queue = mod.setting.getValue('amqp.REQUEST_QUEUE') 
  await mod.amqpChannel.assertQueue(queue)

  const _narrationCsv = narrationCsv.replace(/\r/g, '')

  const resultFileName = mod.setting.getValue('path.CHAT_REQUEST_FILE_NAME')
  const MOVIE_DIR_PATH = mod.setting.getValue('path.MOVIE_DIR_PATH') 
  const IMAGE_EXT = '.png'
  const dateStr = mod.lib.formatDate({ format: 'YYYYMMDD_hhmmss' })
  const dirPath = `${MOVIE_DIR_PATH}${requestId}/${dateStr}/`
  mod.output.makeDir({ dirPath, })
  const chatgptResultJsonFilePath = `${dirPath}${resultFileName}`
  mod.output.saveFile({ filePath: chatgptResultJsonFilePath, fileBuffer: Buffer.from(JSON.stringify({ requestId, title, themeText: '', prompt: '', chatgptResponse: '', narrationCsv: _narrationCsv, imagePromptList: [] }, null, 2)) })
  const pathCompatibleForIndexPage = `${MOVIE_DIR_PATH}${requestId}/${resultFileName}`
  mod.output.copyFile({ filePathFrom: chatgptResultJsonFilePath, filePathTo: pathCompatibleForIndexPage })

  console.log({ requestId, title, _narrationCsv })

  fileList.forEach((file) => {
    mod.output.saveFile({ filePath: `${dirPath}/${file.originalname}`, fileBuffer: file.buffer })
  })

  const messageBuffer = mod.lib.getMainRequest({ requestId, fileList, title, narrationCsv: _narrationCsv })
  mod.amqpChannel.sendToQueue(queue, messageBuffer)

  const handleResult = { isRegistered: true, requestId }
  return handleResult
}

