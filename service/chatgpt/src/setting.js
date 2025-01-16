const setting = {}

const init = ({ env }) => {
  setting.env = {}
  setting.env.OPENAI_CHATGPT_API_KEY = env.OPENAI_CHATGPT_API_KEY
  setting.env.AZUREAI_GPT4_API_KEY = env.AZUREAI_GPT4_API_KEY
  setting.env.AZUREAI_ENDPOINT = env.AZUREAI_ENDPOINT
  setting.env.TEXT_AI_PLATFORM = env.TEXT_AI_PLATFORM

  setting.env.AMQP_USER = env.AMQP_USER
  setting.env.AMQP_PASS = env.AMQP_PASS
  setting.env.AMQP_HOST = env.AMQP_HOST
  setting.env.AMQP_PORT = env.AMQP_PORT
}

setting.amqp = {}
setting.amqp.CHATGPT_PROMPT_QUEUE = 'chatgpt-prompt-queue'
setting.amqp.RESPONSE_QUEUE = 'movie-response-queue'

setting.chatgpt = {}
// setting.chatgpt.SLEEP_BEFORE_REQUEST_MS = 5 * 1000
setting.chatgpt.SLEEP_BEFORE_REQUEST_MS = 0.1 * 1000

setting.server = {}
setting.server.DATA_DIR_PATH = '/app/data/'

const getList = (...keyList) => {
  /* eslint-disable no-param-reassign */
  const constantList = keyList.reduce((prev, key) => {
    let value = setting
    for (const keySplit of key.split('.')) {
      value = value[keySplit]
    }
    prev[key.slice(key.lastIndexOf('.') + 1)] = value
    return prev
  }, {})
  for (const key of keyList) {
    if (constantList[key.slice(key.lastIndexOf('.') + 1)] === undefined) {
      throw new Error(`[error] undefined setting constant: ${key}`)
    }
  }
  return constantList
}


const getValue = (key) => {
  let value = setting
  for (const keySplit of key.split('.')) {
    value = value[keySplit]
  }
  return value
}

export default {
  init,
  getList,
  getValue,
}

