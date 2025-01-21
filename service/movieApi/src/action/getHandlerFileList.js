export const getHandlerFileList = ({ handleFileList }) => {
  return async (req, res) => {
    const { requestId, checkFileName } = req.query
    const handleResult = handleFileList({ requestId, checkFileName })

    res.json({ result: handleResult })
  }
}

