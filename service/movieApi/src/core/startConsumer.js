import { mod, store } from './init.js'
export default {}

export const startConsumer = async () => {
  const queue = mod.setting.getValue('amqp.RESPONSE_QUEUE') 
  const MOVIE_DIR_PATH = mod.setting.getValue('path.MOVIE_DIR_PATH') 
  await mod.amqpChannel.assertQueue(queue)

  mod.amqpChannel.consume(queue, (msg) => {
    if (msg !== null) {
      const responseBuffer = msg.content
      console.log('Recieved:', responseBuffer.length)
      mod.amqpChannel.ack(msg)
      const delimiterDelimiterBuffer = Buffer.from('|')
      const splitResultList = mod.lib.parseBufferList({ buffer: responseBuffer, delimiterDelimiterBuffer })

      const requestId = splitResultList[0].toString()
      const requestType = splitResultList[1].toString()

      const dirPath = `${MOVIE_DIR_PATH}${requestId}/`
      mod.output.makeDir({ dirPath, })
      if (requestType === 'main') {
        const filePath = `${dirPath}output.mp4`
        const fileBuffer = splitResultList[2]
        mod.output.saveFile({ filePath, fileBuffer })
        if (!store[requestId]) {
          store[requestId] = {}
        }
        store[requestId].status = 'complete'
      } else if (requestType === 'chatgpt') {
        // chatgpt
        const filePath = `${dirPath}story-by-chatgpt.txt`
        const chatgptResponseBuffer = splitResultList[2]
        mod.output.saveFile({ filePath, fileBuffer: chatgptResponseBuffer })
        if (!store[requestId]) {
          store[requestId] = {}
        }
        store[requestId].status = 'creating-movie'
        store[requestId].chatgpt = chatgptResponseBuffer.toString()
      } else {
        console.log(`invalid requestType: ${requestType}`)
      }
    } else {
      console.log('Consumer cancelled by server')
      throw new Error()
    }
  })
}

