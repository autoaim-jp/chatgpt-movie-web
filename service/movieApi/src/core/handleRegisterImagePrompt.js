import { mod, store } from './init.js'
export default {}

export const handleRegisterImagePrompt = async ({ imagePrompt }) => {
  const queue = mod.setting.getValue('amqp.CHATGPT_PROMPT_QUEUE') 
  const prompt = imagePrompt || mod.setting.getValue('prompt.IMAGE_TEST')

  await mod.amqpChannel.assertQueue(queue)

  const requestId = mod.lib.getUlid()
  const requestObj = {
    requestId,
    requestType: 'image',
    prompt,
  }
  const requestObjStr = JSON.stringify(requestObj)
  mod.amqpChannel.sendToQueue(queue, Buffer.from(requestObjStr))

  const handleResult = { isRegistered: true, requestId }
  return handleResult
}

