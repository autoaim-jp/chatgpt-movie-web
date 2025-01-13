export const getHandlerRegisterMainPrompt = ({ handleRegisterMainPrompt }) => {
  return async (req, res) => {
    // console.log({ debug: true, request: 'ok!', prompt })
    const fileList = req.files
    const { title, narrationCsv } = req.body
    const handleResult = await handleRegisterMainPrompt({ fileList, title, narrationCsv })

    res.json({ result: handleResult })
  }
}

