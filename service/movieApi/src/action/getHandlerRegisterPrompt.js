export const getHandlerRegisterPrompt = ({ handleRegisterPrompt }) => {
  return async (req, res) => {
    const { narrationCsv, prompt } = req.body
    console.log({ debug: true, request: 'ok!', narrationCsv, prompt })

    const handleResult = await handleRegisterPrompt({ narrationCsv, prompt })

    res.json({ result: handleResult })
  }
}

