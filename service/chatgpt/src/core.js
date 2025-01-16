const mod = {}
const store = {}

const init = async ({ setting, output, input, lib, amqpConnection }) => {
  const amqpPromptChannel = await amqpConnection.createChannel()
  mod.amqpPromptChannel = amqpPromptChannel
  const amqpResponseChannel = await amqpConnection.createChannel()
  mod.amqpResponseChannel = amqpResponseChannel

  mod.setting = setting
  mod.output = output
  mod.input = input
  mod.lib = lib

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

const handleRequest = async ({ requestJson }) => {
  const { requestType } = requestJson
  if (requestType === 'text') {
    const { requestId } = requestJson 
    const prompt = requestJson.prompt

    // ./data/requestId/ ディレクトリ作成
    const dirPath = `${mod.setting.getValue('server.DATA_DIR_PATH')}${requestId}/`
    mod.output.mkdir({ dirPath })

    const dateStr = mod.lib.formatDate({ format: 'YYYYMMDD_hhmmss' })
    const promptJsonFilePath = `${dirPath}${dateStr}_prompt.json`
    const responseJsonFilePath = `${dirPath}${dateStr}_response.json`
    // ./data/requestId/<時刻>_prompt.jsonにプロンプトを保存
    const promptJson = {
      model: "gpt-4o",
      messages: [
        {role: "system", content: "You are a helpful assistant."},
        {role: "user", content: prompt}
      ]
    }
    const promptJsonStr = JSON.stringify(promptJson)
    mod.output.saveFile({ filePath: promptJsonFilePath, content: promptJsonStr })

    const TEXT_AI_PLATFORM = mod.setting.getValue('env.TEXT_AI_PLATFORM')
    if (TEXT_AI_PLATFORM === 'openai') {
      const OPENAI_CHATGPT_API_KEY = mod.setting.getValue('env.OPENAI_CHATGPT_API_KEY')
      const commandList = [`OPENAI_CHATGPT_API_KEY="${OPENAI_CHATGPT_API_KEY}"`, '/app/lib/openai_text.sh', responseJsonFilePath, promptJsonFilePath]
      await mod.lib.fork({ commandList, resultList: [] })
    } else if (TEXT_AI_PLATFORM === 'azureai') {
      const AZUREAI_GPT4_API_KEY = mod.setting.getValue('env.AZUREAI_GPT4_API_KEY')
      const AZUREAI_ENDPOINT = mod.setting.getValue('env.AZUREAI_ENDPOINT')
      const commandList = [`AZUREAI_ENDPOINT=${AZUREAI_ENDPOINT}`, `AZUREAI_GPT4_API_KEY="${AZUREAI_GPT4_API_KEY}"`, '/app/lib/azureai_text.sh', responseJsonFilePath, promptJsonFilePath]
      await mod.lib.fork({ commandList, resultList: [] })
    } else {
      console.log(`invalid ai platform: ${TEXT_AI_PLATFORM}`)
      return
    }

    const responseJson = JSON.parse(mod.input.readFile({ filePath: responseJsonFilePath }))
    const responseMessage = responseJson.choices[0].message.content
    console.log('chatgpt response:', responseMessage)
    const responseBufferList = []
    responseBufferList.push(Buffer.from('chatgpt'))
    responseBufferList.push(Buffer.from(responseMessage))
    const responseBuffer = _createResponseBuffer({ requestId, responseBufferList })
  
    const responseQueue = mod.setting.getValue('amqp.RESPONSE_QUEUE') 
    mod.amqpResponseChannel.sendToQueue(responseQueue, responseBuffer)

  } else {
    console.log(`invalid requestType: ${requestType}`)
  }
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

      const handleRequestResult = await handleRequest({ requestJson })

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

