import { mod } from './init.js'
export default {}

export const getFileDirList = ({ dirPath }) => {
  let fileDirEntryList = []
  try {
    fileDirEntryList = mod.fs.readdirSync(dirPath, { withFileTypes: true })
  } catch(e){
    return []
  }

  const fileDirList = fileDirEntryList.map((entry) => {
    if(entry.isDirectory()) {
      return `${entry.name}/`
    } else {
      return entry.name
    }
  })

  return fileDirList
}

