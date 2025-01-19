export const getHandlerLatestFileList = ({ handleLatestFileList }) => {
  return async (req, res) => {
    const handleResult = handleLatestFileList()

    res.json({ result: handleResult })
  }
}

