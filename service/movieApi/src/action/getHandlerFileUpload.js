export const getHandlerFileUpload = ({ FORM_UPLOAD, parseMultipartFileUpload }) => {
  return async (req, res, next) => {
    const uploadResult = await parseMultipartFileUpload({ req, formKey: FORM_UPLOAD })
    console.log({ uploadResult })
    if (!uploadResult) {
      res.json({ result: uploadResult })
      return
    }

    next()
  }
}

