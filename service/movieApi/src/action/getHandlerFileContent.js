export const getHandlerFileContent = ({ handleFileContent }) => {
  return async (req, res) => {
    const { requestId, fileName } = req.query

    const handleResultBuffer = handleFileContent({ requestId, fileName })

    // res.json({ result: handleResult })
    res.end(handleResultBuffer)
  }
}

