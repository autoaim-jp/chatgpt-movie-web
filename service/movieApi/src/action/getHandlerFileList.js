export const getHandlerFileList = ({ handleFileList }) => {
  return async (req, res) => {
    const { requestId } = req.query
    const handleResult = handleFileList({ requestId  })

    res.json({ result: handleResult })
  }
}

