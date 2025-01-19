export const getHandlerRegisterPingPrompt = ({ handleRegisterPingPrompt }) => {
  return async (req, res) => {
    const { rightTopText, leftTopText, rightBottomText } = req.body
    // console.log({ debug: true, request: 'ok!', prompt })
    const fileBuffer = req.file.buffer

    const handleResult = await handleRegisterPingPrompt({ 
      rightTopText, leftTopText, rightBottomText,
      fileBuffer, 
    })

    res.json({ result: handleResult })
  }
}

