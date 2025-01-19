import { mod } from './init.js'
export default {}

export const getLatestFileList = ({ dirPath }) => {
  let fileDirEntryList = []
  try {
    fileDirEntryList = mod.fs.readdirSync(dirPath, { withFileTypes: true })

    const dirList = fileDirEntryList 
      .filter(item => item.isDirectory())
      .map(dir => dir.name)
      .sort()

    if (dirList.length === 0) {
      return []
    }

    const latestDir = dirList[dirList.length - 1]

    const innerFileDirEntryList = mod.fs.readdirSync(`${dirPath}/${latestDir}`, { withFileTypes: true })
    return innerFileDirEntryList.map((entry) => `${latestDir}/${entry.name}`)
  } catch (e) {
    console.log(e)
    return []
  }

  return []
}


