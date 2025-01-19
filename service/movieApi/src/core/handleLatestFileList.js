import { mod, store } from './init.js'
export default {}

export const handleLatestFileList = () => {
  const MOVIE_DIR_PATH = mod.setting.getValue('path.MOVIE_DIR_PATH') 
  const dirPath = MOVIE_DIR_PATH
  const fileDirList = mod.input.getFileDirListWithLatestTitle({ dirPath })
  const handleResult = { result: { fileDirList } }
  return handleResult
}

