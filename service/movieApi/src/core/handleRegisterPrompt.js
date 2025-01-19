import { mod, store } from './init.js'
export default {}

export const handleRegisterPrompt = async ({ prompt }) => {
  const queue = mod.setting.getValue('amqp.CHATGPT_PROMPT_QUEUE') 
  await mod.amqpChannel.assertQueue(queue)

  const requestId = mod.lib.getUlid()
  const requestObj = {
    requestId,
    requestType: 'text',
    prompt,
  }
  const requestObjStr = JSON.stringify(requestObj)

  mod.amqpChannel.sendToQueue(queue, Buffer.from(requestObjStr))

  const handleResult = { isRegistered: true, requestId }
  return handleResult
}

