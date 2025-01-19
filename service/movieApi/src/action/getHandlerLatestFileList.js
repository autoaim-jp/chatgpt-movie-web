export const getHandlerLatestFileList = ({ handleLatestFileList }) => {
  return async (req, res) => {
    const { requestId } = req.query
    const handleResult = handleLatestFileList({ requestId })

    res.json({ result: handleResult })
  }
}

