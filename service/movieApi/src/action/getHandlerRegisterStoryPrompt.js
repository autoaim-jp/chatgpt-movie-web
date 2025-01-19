export const getHandlerRegisterStoryPrompt = ({ handleRegisterStoryPrompt }) => {
  return async (req, res) => {
    const { themeText, targetText } = req.body

    const handleResult = await handleRegisterStoryPrompt({ 
      themeText, targetText
    })

    res.json({ result: handleResult })
  }
}

