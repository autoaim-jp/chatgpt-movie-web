import { mod, store } from './init.js'
export default {}

export const handleRegisterMainPrompt = async ({ fileList, title, narrationCsv }) => {
  const queue = mod.setting.getValue('amqp.REQUEST_QUEUE') 
  await mod.amqpChannel.assertQueue(queue)

  const requestId = mod.lib.getUlid()
  console.log({ requestId, title, narrationCsv })
  const messageBuffer = _getMainRequest({ requestId, fileList, title, narrationCsv })
  mod.amqpChannel.sendToQueue(queue, messageBuffer)

  const handleResult = { isRegistered: true, requestId }
  return handleResult
}

const _getMainRequest = ({ requestId, fileList, title, narrationCsv }) => {
  const requestType = 'main'

  const currentDelimiter = Buffer.from(mod.lib.getUlid())
  console.log(`delimiter: ${currentDelimiter.toString()}`)
  const delimiterDelimiter = Buffer.from('|')
  let messageBuffer = Buffer.concat([
    currentDelimiter,
    delimiterDelimiter,
    Buffer.from(requestType),
    currentDelimiter,
    Buffer.from(requestId),
    currentDelimiter,
    Buffer.from(title),
    currentDelimiter,
    Buffer.from(narrationCsv),
  ])

  fileList.forEach((file) => {
    console.log({ originalname: file.originalname })
    messageBuffer = Buffer.concat([
      messageBuffer,
      currentDelimiter,
      file.buffer
    ])
  })

  messageBuffer = Buffer.concat([
    messageBuffer,
    currentDelimiter,
  ])

  return messageBuffer
}

