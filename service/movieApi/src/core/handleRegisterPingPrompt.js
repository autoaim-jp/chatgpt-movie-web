import { mod, store } from './init.js'
export default {}

export const handleRegisterPingPrompt = async ({ fileBuffer, rightTopText, leftTopText, rightBottomText }) => {
  const queue = mod.setting.getValue('amqp.REQUEST_QUEUE') 
  await mod.amqpChannel.assertQueue(queue)

  const requestId = mod.lib.getUlid()
  const messageBuffer = _getPingRequest({ requestId, fileBuffer, rightTopText, leftTopText, rightBottomText })
  mod.amqpChannel.sendToQueue(queue, messageBuffer)

  const handleResult = { isRegistered: true, requestId }
  return handleResult
}

const _getPingRequest = ({ requestId, fileBuffer, rightTopText, leftTopText, rightBottomText }) => {
  const requestType = 'ping'

  const currentDelimiter = Buffer.from(mod.lib.getUlid())
  const delimiterDelimiter = Buffer.from('|')
  const messageBuffer = Buffer.concat([
    currentDelimiter,
    delimiterDelimiter,
    Buffer.from(requestType),
    currentDelimiter,
    Buffer.from(requestId),
    currentDelimiter,
    Buffer.from(rightTopText),
    currentDelimiter,
    Buffer.from(leftTopText),
    currentDelimiter,
    Buffer.from(rightBottomText),
    currentDelimiter,
    fileBuffer, 
    currentDelimiter,
  ])

  return messageBuffer
}

