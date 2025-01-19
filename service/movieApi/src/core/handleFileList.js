import { mod, store } from './init.js'
export default {}

export const handleFileList = ({ requestId }) => {
  const MOVIE_DIR_PATH = mod.setting.getValue('path.MOVIE_DIR_PATH') 
  const dirPath = requestId? `${MOVIE_DIR_PATH}${requestId}/`: MOVIE_DIR_PATH
  const fileDirList = mod.input.getFileDirListWithTitle({ dirPath })
  const handleResult = { result: { fileDirList } }
  return handleResult
}

