const mod = {}

const init = ({ spawn, ulid, fs }) => {
  mod.spawn = spawn
  mod.ulid = ulid
  mod.fs = fs
}

const getUlid = () => {
  return mod.ulid()
}

const createAmqpConnection = async ({ amqplib, user, pass, host, port }) => {
  const conn = await amqplib.connect(`amqp://${user}:${pass}@${host}:${port}`)
  return conn
}

const awaitSleep = ({ ms }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
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

const formatDate = ({ format, date }) => {
  if (format === undefined) {
    format = 'YYYY-MM-DD hh:mm:ss'
  }
  if (date === undefined) {
    date = new Date()
  }

  return format.replace(/YYYY/g, date.getFullYear())
    .replace(/MM/g, (`0${date.getMonth() + 1}`).slice(-2))
    .replace(/DD/g, (`0${date.getDate()}`).slice(-2))
    .replace(/hh/g, (`0${date.getHours()}`).slice(-2))
    .replace(/mm/g, (`0${date.getMinutes()}`).slice(-2))
    .replace(/ss/g, (`0${date.getSeconds()}`).slice(-2))
}

export default {
  init,
  getUlid,
  createAmqpConnection,
  awaitSleep,
  fork,
  formatDate,
}

