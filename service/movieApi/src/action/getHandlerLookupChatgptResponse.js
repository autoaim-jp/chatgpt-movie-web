export const getHandlerLookupChatgptResponse = ({ handleLookupChatgptResponse }) => {
  return async (req, res) => {
    const { requestId } = req.query

    const handleResult = handleLookupChatgptResponse({ requestId })

    res.json({ result: handleResult })
  }
}

