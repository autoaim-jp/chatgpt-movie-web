import dotenv from 'dotenv'
import amqplib from 'amqplib'
import { ulid } from 'ulid'
import { spawn } from 'child_process'
import OpenAI from 'openai'
import fs from 'fs'

import setting from './setting.js'
import output from './output.js'
import core from './core.js'
import lib from './lib.js'

const asocial = {
  setting, output, core, lib
}
const a = asocial

const init = async () => {
  dotenv.config()
  a.setting.init({ env: process.env })
  a.lib.init({ spawn, ulid })
  a.output.init({ fs })
  const { AMQP_USER: user, AMQP_PASS: pass, AMQP_HOST: host, AMQP_PORT: port } = a.setting.getList('env.AMQP_USER', 'env.AMQP_PASS', 'env.AMQP_HOST', 'env.AMQP_PORT')
  const amqpConnection = await a.lib.createAmqpConnection({ amqplib, user, pass, host, port })
  await core.init({ setting, lib, amqpConnection, OpenAI })
}

const main = async () => {
  await a.app.init()
  a.core.startConsumer()
}

const app = {
  init,
  main,
}
asocial.app = app

main()

export default app

