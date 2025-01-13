export const getHandlerRegisterPrompt = ({ handleRegisterPrompt }) => {
  return async (req, res) => {
    const { prompt } = req.body
    console.log({ debug: true, request: 'ok!', prompt })

    const handleResult = await handleRegisterPrompt({ prompt })

    res.json({ result: handleResult })
  }
}

