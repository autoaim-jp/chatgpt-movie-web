const mod = {}
const init = ({ spawn, ulid, multer }) => {
  mod.spawn = spawn
  mod.ulid = ulid
  mod.multer = multer
}

const createAmqpConnection = async ({ amqplib, user, pass, host, port }) => {
  const conn = await amqplib.connect(`amqp://${user}:${pass}@${host}:${port}`)
  return conn
}

const getUlid = () => {
  return mod.ulid()
}

const parseMultipartFileUpload = ({ req, formKey }) => {
  const upload = mod.multer({
    storage: mod.multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 * 1024 },
  })

  return new Promise((resolve) => {
    upload.single(formKey)(req, null, (error) => {
      if (error instanceof mod.multer.MulterError) {
        return resolve({ error: true, message: error.message })
      } if (error) {
        return resolve({ error: true, message: 'unkown error' })
      }

      return resolve({ error: false, message: 'success' })
    })
  })
}

const parseMultipartFileListUpload = ({ req, formKey }) => {
  const upload = mod.multer({
    storage: mod.multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 * 1024 },
  })

  return new Promise((resolve) => {
    upload.array(formKey)(req, null, (error) => {
      if (error instanceof mod.multer.MulterError) {
        return resolve({ error: true, message: error.message })
      } if (error) {
        return resolve({ error: true, message: 'unkown error' })
      }

      return resolve({ error: false, message: 'success' })
    })
  })
}

const parseBufferList = ({ buffer, delimiterDelimiterBuffer }) => {
  const delimiterIndex = buffer.indexOf(delimiterDelimiterBuffer)
  const currentDelimiter = buffer.slice(0, delimiterIndex)
  const bufferAfterCurrentDelimiter = buffer.slice(delimiterIndex + delimiterDelimiterBuffer.length)
  const MAX_PARAMETER_N = 10

  const _getStrAndBuffer = ({ buffer }) => {
    if (buffer === null) {
      return { targetBuffer: null, restBuffer: null }
    }
    const delimiterIndex = buffer.indexOf(currentDelimiter)
    if (delimiterIndex === -1) {
      return { targetBuffer: null, restBuffer: null }
    }
    const targetBuffer = buffer.slice(0, delimiterIndex)

    const restBuffer = buffer.slice(delimiterIndex + currentDelimiter.length)

    return { targetBuffer, restBuffer }
  }

  let currentRestBuffer = bufferAfterCurrentDelimiter
  const splitResultList = []
  const _list = [... new Array(MAX_PARAMETER_N)]
  _list.forEach((_, i) => {
    const { targetBuffer, restBuffer } = _getStrAndBuffer({ buffer: currentRestBuffer })
    currentRestBuffer = restBuffer
    if(targetBuffer === null) {
      return
    }
    splitResultList.push(targetBuffer)
  })

  return splitResultList
}

const fork = ({ commandList, resultList }) => {
  return new Promise((resolve) => {
    const proc = mod.spawn(commandList[0], commandList.slice(1), { shell: true })

    proc.stderr.on('data', (err) => {
      console.log({ at: 'lib.fork', error: err.toString() })
      const result = ((err || '').toString() || '')
      resultList.push(result)
    })
    proc.stdout.on('data', (data) => {
      console.log({ at: 'lib.fork', data: data.toString() })
      const result = ((data || '').toString() || '')
      resultList.push(result)
    })
    proc.on('close', (code) => {
      console.log('spawn', code)
      resolve()
    })
  })
}

const getMainRequest = ({ requestId, fileList, title, narrationCsv }) => {
  const requestType = 'main'

  const currentDelimiter = Buffer.from(getUlid())
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

const getImageRequest = ({ prompt, filePath, requestId }) => {
  const _requestId = requestId || getUlid()
  const requestObj = {
    requestId: _requestId,
    requestType: 'image',
    filePath,
    prompt,
  }
  const requestObjStr = JSON.stringify(requestObj)

  return { requestId, buffer: Buffer.from(requestObjStr) }
}


export default {
  init,
  createAmqpConnection,
  getUlid,
  parseMultipartFileUpload,
  parseMultipartFileListUpload,
  parseBufferList,
  fork,

  getMainRequest,
  getImageRequest,
}

