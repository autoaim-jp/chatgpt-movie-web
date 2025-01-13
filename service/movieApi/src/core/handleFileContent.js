import { mod, store } from './init.js'
export default {}

export const handleFileContent = ({ requestId, fileName }) => {
  const MOVIE_DIR_PATH = mod.setting.getValue('path.MOVIE_DIR_PATH') 
  const filePath = `${MOVIE_DIR_PATH}${requestId}/${fileName}`
  const handleResultBuffer = mod.input.getFileContent({ filePath })
  return handleResultBuffer
}

