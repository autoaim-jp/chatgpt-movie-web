import { mod, store } from './init.js'
export default {}

export const handleLookupChatgptResponse = ({ requestId }) => {
  const handleResult = store[requestId]
  if (!handleResult) {
    return { status: 'waiting' }
  }

  return handleResult
}

