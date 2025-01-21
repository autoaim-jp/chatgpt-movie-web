export const getHandlerRegisterChatPrompt = ({ handleRegisterChatPrompt, startGenerateImageAndMovie }) => {
  return async (req, res) => {
    const { themeText } = req.body

    const handleResult = await handleRegisterChatPrompt({ 
      themeText,
      startGenerateImageAndMovie,
    })

    res.json({ result: handleResult })
  }
}

