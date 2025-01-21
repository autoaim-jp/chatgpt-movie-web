export const getHandlerRegisterMainPrompt = ({ handleRegisterMainPrompt }) => {
  return async (req, res) => {
    // console.log({ debug: true, request: 'ok!', prompt })
    const fileList = req.files
    const { requestId, title, narrationCsv } = req.body
    const handleResult = await handleRegisterMainPrompt({ requestId, fileList, title, narrationCsv })

    res.json({ result: handleResult })
  }
}

