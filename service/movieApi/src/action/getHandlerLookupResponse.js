export const getHandlerLookupResponse = ({ handleLookupResponse }) => {
  return async (req, res) => {
    const { requestId } = req.query

    const handleResult = handleLookupResponse({ requestId })

    res.json({ result: handleResult })
  }
}

