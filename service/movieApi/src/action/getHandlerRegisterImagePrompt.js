export const getHandlerRegisterImagePrompt = ({ handleRegisterImagePrompt }) => {
  return async (req, res) => {
    const { imagePrompt } = req.body

    const handleResult = await handleRegisterImagePrompt({ 
      imagePrompt
    })

    res.json({ result: handleResult })
  }
}

