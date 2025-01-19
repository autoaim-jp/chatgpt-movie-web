import { mod } from './init.js'
export default {}

export const getFileDirListWithLatestTitle = ({ dirPath }) => {
  let fileDirEntryList = []
  try {
    fileDirEntryList = mod.fs.readdirSync(dirPath, { withFileTypes: true })
  } catch (e) {
    console.log('dir not found', e)
    return []
  }

  const fileDirList = fileDirEntryList.reduce((acc, entry) => {
    // console.log(entry.name)
    if (!entry.isDirectory()) {
      return acc
    }
    const dirName = `${entry.name}/`

    const innerFileDirList = mod.fs.readdirSync(dirName, { withFileTypes: true })

    const innerDirList = innerFileDirList
      .filter(item => item.isDirectory())
      .map(dir => dir.name)
      .sort()

    if (innerDirList.length === 0) {
      return acc
    }

    const latestDir = innerDirList[innerDirList.length - 1]
    const filePath = `${dirPath}/${entry.name}/${latestDir}/chatgpt_result_json_chat.txt`
    if (!mod.fs.existsSync(filePath)) {
      return acc
    }

    try {
      const fileContent = mod.fs.readFileSync(filePath, 'utf-8')
      const jsonContent = JSON.parse(fileContent)

      // console.log(jsonContent)

      if (!jsonContent || !jsonContent.title) {
        return acc
      }
      acc[dirName] = jsonContent.title
    } catch (e) {
      console.log(e)
      return acc
    }
  }, {})

  return fileDirList
}


