import { mod, store } from './init.js'
export default {}

export const handleRegisterStoryPrompt = async ({ themeText, targetText }) => {
  const queue = mod.setting.getValue('amqp.CHATGPT_PROMPT_QUEUE') 
  const prompt = mod.setting.getValue('prompt.STORY_VER1')
    .replace(/__THEME_TEXT__/g, themeText)
    .replace(/__TARGET_TEXT__/g, targetText)

  await mod.amqpChannel.assertQueue(queue)

  const requestId = mod.lib.getUlid()
  const requestObj = {
    requestId,
    requestType: 'text',
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

}

