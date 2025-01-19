import { init } from './core/init.js'
import { handleRegisterPingPrompt } from './core/handleRegisterPingPrompt.js'
import { handleRegisterDummyPrompt } from './core/handleRegisterDummyPrompt.js'
import { handleRegisterMainPrompt } from './core/handleRegisterMainPrompt.js'
import { handleLookupResponse } from './core/handleLookupResponse.js'
import { handleFileList } from './core/handleFileList.js'
import { handleFileContent } from './core/handleFileContent.js'
import { handleRegisterPrompt } from './core/handleRegisterPrompt.js'
import { handleLookupChatgptResponse } from './core/handleLookupChatgptResponse.js'
import { handleRegisterStoryPrompt } from './core/handleRegisterStoryPrompt.js'
import { handleRegisterImagePrompt } from './core/handleRegisterImagePrompt.js'
import { startConsumer } from './core/startConsumer.js'
import { handleRegisterChatPrompt } from './core/handleRegisterChatPrompt.js'
import { startGenerateImageAndMovie } from './core/startGenerateImageAndMovie.js'


export default {
  init,
  handleRegisterPingPrompt,
  handleRegisterDummyPrompt,
  handleRegisterMainPrompt,
  handleFileList,
  handleFileContent,
  handleLookupResponse,
  handleRegisterPrompt,
  handleLookupChatgptResponse,
  handleRegisterStoryPrompt,
  handleRegisterImagePrompt,
  startConsumer,
  handleRegisterChatPrompt,
  startGenerateImageAndMovie,
}

