export const getHandlerFileListUpload = ({ FILE_LIST_UPLOAD, parseMultipartFileListUpload }) => {
  return async (req, res, next) => {
    const uploadResult = await parseMultipartFileListUpload({ req, formKey: FILE_LIST_UPLOAD })
    console.log({ uploadResult })
    if (!uploadResult) {
      res.json({ result: uploadResult })
      return
    }

    next()
  }
}

