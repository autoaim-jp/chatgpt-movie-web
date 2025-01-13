import { init } from './core/init.js'
import { handleRegisterPingPrompt } from './core/handleRegisterPingPrompt.js'
import { handleRegisterDummyPrompt } from './core/handleRegisterDummyPrompt.js'
import { handleRegisterMainPrompt } from './core/handleRegisterMainPrompt.js'
import { handleLookupResponse } from './core/handleLookupResponse.js'
import { handleFileList } from './core/handleFileList.js'
import { handleFileContent } from './core/handleFileContent.js'
import { handleRegisterPrompt } from './core/handleRegisterPrompt.js'
import { handleLookupChatgptResponse } from './core/handleLookupChatgptResponse.js'
import { extractBetweenTag } from './core/extractBetweenTag.js'
import { extractLast5ColonPart } from './core/extractLast5ColonPart.js'
import { extractFirstColonPart } from './core/extractFirstColonPart.js'
import { handleRegisterStoryPrompt } from './core/handleRegisterStoryPrompt.js'
import { startConsumer } from './core/startConsumer.js'


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
  startConsumer,
}

