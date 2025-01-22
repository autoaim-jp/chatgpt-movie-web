export const getHandlerFileContent = ({ handleFileContent }) => {
  return async (req, res) => {
    const { requestId, fileName } = req.query

    const handleResultBuffer = handleFileContent({ requestId, fileName })

    // res.json({ result: handleResult })
    if(/\.mp4$/.test(fileName)) {
      res.setHeader('Content-Type', 'video/mp4')
      res.setHeader('Content-Disposition', `attachment; filename="${fileName.replace(/^.*\//g, '')}"`)
    }
    res.end(handleResultBuffer)
  }
}

