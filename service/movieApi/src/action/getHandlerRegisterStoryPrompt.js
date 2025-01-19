export const getHandlerRegisterStoryPrompt = ({ handleRegisterStoryPrompt, startGenerateImageAndMovie }) => {
  return async (req, res) => {
    const { themeText, targetText } = req.body

    const handleResult = await handleRegisterStoryPrompt({ 
      themeText, targetText,
      startGenerateImageAndMovie,
    })

    res.json({ result: handleResult })
  }
}

