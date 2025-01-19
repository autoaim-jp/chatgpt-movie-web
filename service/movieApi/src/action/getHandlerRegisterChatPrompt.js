export const getHandlerRegisterChatPrompt = ({ handleRegisterChatPrompt }) => {
  return async (req, res) => {
    const { themeText } = req.body

    const handleResult = await handleRegisterChatPrompt({ 
      themeText
    })

    res.json({ result: handleResult })
  }
}

