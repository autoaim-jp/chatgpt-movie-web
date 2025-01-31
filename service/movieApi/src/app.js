import dotenv from 'dotenv'
import path from 'path'
import { ulid } from 'ulid'
import express from 'express'
import amqplib from 'amqplib'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import multer from 'multer'
import fs from 'fs'
import { spawn } from 'child_process'

import setting from './setting.js'
import output from './output.js'
import core from './core.js'
import input from './input.js'
import action from './action.js'
import lib from './lib.js'

const asocial = {
  setting, output, core, input, action, lib
}
const a = asocial

const _getDefaultRouter = () => {
  const expressRouter = express.Router()

  const appPath = `${path.dirname(new URL(import.meta.url).pathname)}/`
  expressRouter.use(express.static(appPath + a.setting.getValue('path.PUBLIC_STATIC_DIR'), { index: 'index.html', extensions: ['html'] }))

  expressRouter.use(bodyParser.urlencoded({ extended: true }))
  expressRouter.use(bodyParser.json())
  expressRouter.use(cookieParser())

  return expressRouter
}

const _getFunctionRouter = () => {
  const expressRouter = express.Router()

  const { REGISTER_PROMPT_PING, REGISTER_PROMPT_DUMMY, REGISTER_PROMPT_MAIN, LOOKUP_RESPONSE, GET_FILE_LIST, GET_FILE_CONTENT, FORM_UPLOAD, FILE_LIST_UPLOAD, } = a.setting.getList('api.REGISTER_PROMPT_PING', 'api.REGISTER_PROMPT_DUMMY', 'api.REGISTER_PROMPT_MAIN', 'api.LOOKUP_RESPONSE', 'api.GET_FILE_LIST', 'api.GET_FILE_CONTENT', 'key.FORM_UPLOAD', 'key.FILE_LIST_UPLOAD')
  // chatgpt
  const { REGISTER_PROMPT, LOOKUP_CHATGPT_RESPONSE, REGISTER_STORY_PROMPT, REGISTER_IMAGE_PROMPT } = a.setting.getList('api.REGISTER_PROMPT', 'api.LOOKUP_CHATGPT_RESPONSE', 'api.REGISTER_STORY_PROMPT', 'api.REGISTER_IMAGE_PROMPT')
  const { REGISTER_CHAT_PROMPT, GET_LATEST_FILE_LIST } = a.setting.getList('api.REGISTER_CHAT_PROMPT', 'api.GET_LATEST_FILE_LIST')

  const fileUploadHandler = a.action.getHandlerFileUpload({
    FORM_UPLOAD,
    parseMultipartFileUpload: a.lib.parseMultipartFileUpload
  })

  // アップロードされたファイルを処理
  const registerPingPromptHandler = a.action.getHandlerRegisterPingPrompt({
    handleRegisterPingPrompt: a.core.handleRegisterPingPrompt
  })
  expressRouter.post(REGISTER_PROMPT_PING, fileUploadHandler, registerPingPromptHandler)

  // main_dummy.shの動作確認
  const registerDummyPromptHandler = a.action.getHandlerRegisterDummyPrompt({
    handleRegisterDummyPrompt: a.core.handleRegisterDummyPrompt
  })
  expressRouter.post(REGISTER_PROMPT_DUMMY, registerDummyPromptHandler)

  // 画像とcsvをアップロード
  const fileListUploadHandler = a.action.getHandlerFileListUpload({
    FILE_LIST_UPLOAD,
    parseMultipartFileListUpload: a.lib.parseMultipartFileListUpload
  })

  const registerMainPromptHandler = a.action.getHandlerRegisterMainPrompt({
    handleRegisterMainPrompt: a.core.handleRegisterMainPrompt
  })
  expressRouter.post(REGISTER_PROMPT_MAIN, fileListUploadHandler, registerMainPromptHandler)

  const lookupResponseHandler = a.action.getHandlerLookupResponse({
    handleLookupResponse: a.core.handleLookupResponse
  })
  expressRouter.get(LOOKUP_RESPONSE, lookupResponseHandler)

  const fileListHandler = a.action.getHandlerFileList({
    handleFileList: a.core.handleFileList
  })
  expressRouter.get(GET_FILE_LIST, fileListHandler)

  const fileContentHandler = a.action.getHandlerFileContent({
    handleFileContent: a.core.handleFileContent
  })
  expressRouter.get(GET_FILE_CONTENT, fileContentHandler)

  // chatgpt
  const registerPromptHandler = a.action.getHandlerRegisterPrompt({
    handleRegisterPrompt: a.core.handleRegisterPrompt
  })
  expressRouter.post(REGISTER_PROMPT, registerPromptHandler)

  const registerStoryPromptHandler = a.action.getHandlerRegisterStoryPrompt({
    handleRegisterStoryPrompt: a.core.handleRegisterStoryPrompt,
    startGenerateImageAndMovie: a.core.startGenerateImageAndMovie,
  })
  expressRouter.post(REGISTER_STORY_PROMPT, registerStoryPromptHandler)

  const lookupChatgptResponseHandler = a.action.getHandlerLookupChatgptResponse({
    handleLookupChatgptResponse: a.core.handleLookupChatgptResponse
  })
  expressRouter.get(LOOKUP_CHATGPT_RESPONSE, lookupChatgptResponseHandler)

  const registerImagePromptHandler = a.action.getHandlerRegisterImagePrompt({
    handleRegisterImagePrompt: a.core.handleRegisterImagePrompt
  })
  expressRouter.post(REGISTER_IMAGE_PROMPT, registerImagePromptHandler)

  // chat page
  const registerChatPromptHandler = a.action.getHandlerRegisterChatPrompt({
    handleRegisterChatPrompt: a.core.handleRegisterChatPrompt,
    startGenerateImageAndMovie: a.core.startGenerateImageAndMovie,
  })
  expressRouter.post(REGISTER_CHAT_PROMPT, registerChatPromptHandler)

  const latestFileListHandler = a.action.getHandlerLatestFileList({
    handleLatestFileList: a.core.handleLatestFileList
  })
  expressRouter.get(GET_LATEST_FILE_LIST, latestFileListHandler)

  return expressRouter
}

const _getErrorRouter = () => {
  const expressRouter = express.Router()

  expressRouter.get('*', (req, res) => {
    res.status(404)
    return res.end('not found')
  })

  return expressRouter
}

const startServer = ({ app, port }) => {
  app.listen(port, () => {
    console.log(`listen to port: ${port}`)
  })
}

const init = async () => {
  dotenv.config()
  a.setting.init({ env: process.env })
  a.output.init({ fs })
  const { AMQP_USER: user, AMQP_PASS: pass, AMQP_HOST: host, AMQP_PORT: port } = a.setting.getList('env.AMQP_USER', 'env.AMQP_PASS', 'env.AMQP_HOST', 'env.AMQP_PORT')
  const amqpConnection = await a.lib.createAmqpConnection({ amqplib, user, pass, host, port })
  input.init({ fs })
  await core.init({ setting, output, input, lib, amqpConnection, path })
  lib.init({ spawn, ulid, multer })
}

const main = async () => {
  await a.app.init()
  const expressApp = express()
  expressApp.disable('x-powered-by')

  expressApp.use(_getDefaultRouter())

  expressApp.use(_getFunctionRouter())

  expressApp.use(_getErrorRouter())

  startServer({ app: expressApp, port: a.setting.getValue('env.SERVER_PORT') })

  a.core.startConsumer()
}

const app = {
  init,
  main,
}
asocial.app = app

main()

export default app

