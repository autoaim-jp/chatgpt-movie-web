import { mod, store } from './init.js'
export default {}

export const handleRegisterChatPrompt = async ({ themeText, startGenerateImageAndMovie }) => {
  const queue = mod.setting.getValue('amqp.CHATGPT_PROMPT_QUEUE') 
  const prompt = mod.setting.getValue('prompt.STORY_VER2')
    .replace(/__THEME_TEXT__/g, themeText)

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

      const narrationCsv = mod.lib.extractBetweenTag({ str: result.chatgpt })
      console.log('====================narrationCsvの結果')
      console.log(narrationCsv)

      const imagePromptList = mod.lib.extractLast5ColonPart({ str: result.chatgpt })
      console.log('====================imagePromptListの結果')
      console.log(imagePromptList)

      const title = mod.lib.extractFirstColonPart({ str: result.chatgpt })
      console.log('====================titleの結果')
      console.log(title)

      startGenerateImageAndMovie({ requestId, title, themeText, targetText, prompt, chatgptResponse: result.chatgpt, narrationCsv, imagePromptList })

      clearInterval(waitChatgptResponseInterval)
    } else {
      console.log('checking...:', requestId)
    }
  }, 1 * 1000)

  const handleResult = { isRegistered: true, requestId }
  return handleResult
}

