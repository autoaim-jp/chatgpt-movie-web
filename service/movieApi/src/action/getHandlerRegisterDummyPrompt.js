export const getHandlerRegisterDummyPrompt = ({ handleRegisterDummyPrompt }) => {
  return async (req, res) => {
    // console.log({ debug: true, request: 'ok!', prompt })
    const handleResult = await handleRegisterDummyPrompt({})

    res.json({ result: handleResult })
  }
}

