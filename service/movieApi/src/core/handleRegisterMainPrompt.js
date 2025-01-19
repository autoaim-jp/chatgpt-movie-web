import { mod, store } from './init.js'
export default {}

export const handleRegisterMainPrompt = async ({ fileList, title, narrationCsv }) => {
  const queue = mod.setting.getValue('amqp.REQUEST_QUEUE') 
  await mod.amqpChannel.assertQueue(queue)

  const requestId = mod.lib.getUlid()
  console.log({ requestId, title, narrationCsv })
  const messageBuffer = mod.lib.getMainRequest({ requestId, fileList, title, narrationCsv })
  mod.amqpChannel.sendToQueue(queue, messageBuffer)

  const handleResult = { isRegistered: true, requestId }
  return handleResult
}

