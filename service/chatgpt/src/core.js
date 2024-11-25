const mod = {}
const store = {}

const init = async ({ setting, lib, amqpConnection, OpenAI }) => {
  const amqpPromptChannel = await amqpConnection.createChannel()
  mod.amqpPromptChannel = amqpPromptChannel
  const amqpResponseChannel = await amqpConnection.createChannel()
  mod.amqpResponseChannel = amqpResponseChannel

  mod.setting = setting
  mod.lib = lib

  const OPENAI_CHATGPT_API_KEY = mod.setting.getValue('env.OPENAI_CHATGPT_API_KEY')
  const openaiClient = new OpenAI({
    apiKey: OPENAI_CHATGPT_API_KEY
  })
  mod.openaiClient = openaiClient
}

const _fetchChatgpt = async ({ role, prompt }) => {
  const stream = await mod.openaiClient.chat.completions.create({
    model: 'gpt-4o',
    // model: 'gpt-3.5-turbo',
    messages: [{ role, content: prompt }],
    stream: true,
    max_tokens: 8192,
  })
  let responseMessage = ''
  for await (const part of stream) {
    // process.stdout.write(part.choices[0]?.delta?.content || '')
    responseMessage += part.choices[0]?.delta?.content || ''
  }

  return responseMessage 
}

const _createResponseBuffer = ({ requestId, responseBufferList }) => {
  const currentDelimiter = Buffer.from(mod.lib.getUlid())
  const delimiterDelimiter = Buffer.from('|')
  let messageBuffer = Buffer.concat([
    currentDelimiter,
    delimiterDelimiter,
    Buffer.from(requestId),
  ])

  responseBufferList.forEach((buffer) => {
    messageBuffer = Buffer.concat([
      messageBuffer,
      currentDelimiter,
      buffer,
    ])
  })

  messageBuffer = Buffer.concat([
    messageBuffer,
    currentDelimiter,
  ])

  return messageBuffer
}

const startConsumer = async () => {
  const promptQueue = mod.setting.getValue('amqp.CHATGPT_PROMPT_QUEUE') 
  await mod.amqpPromptChannel.assertQueue(promptQueue)

  const responseQueue = mod.setting.getValue('amqp.RESPONSE_QUEUE') 
  await mod.amqpResponseChannel.assertQueue(responseQueue)

  mod.amqpPromptChannel.consume(promptQueue, async (msg) => {
    if (msg !== null) {
      console.log('Recieved:', msg.content.toString())
      const SLEEP_BEFORE_REQUEST_MS = mod.setting.getValue('chatgpt.SLEEP_BEFORE_REQUEST_MS')
      console.log(`sleep ${SLEEP_BEFORE_REQUEST_MS}s`)
      await mod.lib.awaitSleep({ ms: SLEEP_BEFORE_REQUEST_MS })

      const requestJson = JSON.parse(msg.content.toString())

      const { requestId } = requestJson 
      const role = requestJson.role || mod.setting.getValue('chatgpt.DEFAULT_ROLE')
      const prompt = requestJson.prompt || mod.setting.getValue('chatgpt.DEFAULT_ROLE')

      const responseMessage = await _fetchChatgpt({ role, prompt })
      console.log('chatgpt response:', responseMessage)

      const responseBufferList = []
      responseBufferList.push(Buffer.from('chatgpt'))
      responseBufferList.push(Buffer.from(responseMessage))
      const responseBuffer = _createResponseBuffer({ requestId, responseBufferList })
      mod.amqpResponseChannel.sendToQueue(responseQueue, responseBuffer)

      mod.amqpPromptChannel.ack(msg)
    } else {
      console.log('Consumer cancelled by server')
      throw new Error()
    }
  })
}

export default {
  init,
  startConsumer,
}

