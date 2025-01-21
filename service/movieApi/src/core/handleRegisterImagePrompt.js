import { mod, store } from './init.js'
export default {}

export const handleRegisterImagePrompt = async ({ imagePrompt }) => {
  const queue = mod.setting.getValue('amqp.CHATGPT_PROMPT_QUEUE') 
  const prompt = imagePrompt || mod.setting.getValue('prompt.IMAGE_TEST')
  const filePath = mod.setting.getValue('path.DEFAULT_IMAGE_FILE_PATH') 

  await mod.amqpChannel.assertQueue(queue)

  const { requestId, buffer } = mod.lib.getImageRequest({ prompt, filePath })

  mod.amqpChannel.sendToQueue(queue, buffer)

  const handleResult = { isRegistered: true, requestId }
  return handleResult
}

