import { mod, store } from './init.js'
export default {}

export const handleLatestFileList = ({ requestId }) => {
  const MOVIE_DIR_PATH = mod.setting.getValue('path.MOVIE_DIR_PATH') 
  const dirPath = `${MOVIE_DIR_PATH}${requestId}/`
  const fileDirList = mod.input.getLatestFileList({ dirPath })
  const handleResult = { result: { fileDirList } }
  return handleResult
}

