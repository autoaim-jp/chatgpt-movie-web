import { mod, store } from './init.js'
export default {}

export const handleRegisterPrompt = async ({ narrationCsv, prompt }) => {
  const queue = mod.setting.getValue('amqp.CHATGPT_PROMPT_QUEUE') 
  await mod.amqpChannel.assertQueue(queue)

  const NARRATION_CSV_RULE = mod.setting.getValue('prompt.NARRATION_CSV_RULE')

  const requestId = mod.lib.getUlid()
  const requestObj = {
    requestId,
    requestType: 'narrationCsv',
    prompt: `${prompt}\n${NARRATION_CSV_RULE}\n\`\`\`\n${narrationCsv}\n\`\`\``,
  }
  const requestObjStr = JSON.stringify(requestObj)

  console.log({ requestObj })

  mod.amqpChannel.sendToQueue(queue, Buffer.from(requestObjStr))

  const handleResult = { isRegistered: true, requestId }
  return handleResult
}

