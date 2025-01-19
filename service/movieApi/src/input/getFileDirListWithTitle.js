import { mod } from './init.js'
export default {}

export const getFileDirListWithTitle = ({ dirPath }) => {
  let fileDirEntryList = []
  try {
    fileDirEntryList = mod.fs.readdirSync(dirPath, { withFileTypes: true })
  } catch (e) {
    console.log('dir not found', e)
    return []
  }
  const fileDirList = fileDirEntryList.reduce((acc, entry) => {
    console.log(entry.name)
    if (entry.isDirectory()) {
      const dirName = `${entry.name}/`
      const filePath = `${dirPath}/${entry.name}/chatgpt_result_json.txt`

      if (mod.fs.existsSync(filePath)) {
        try {
          const fileContent = mod.fs.readFileSync(filePath, 'utf-8')
          const jsonContent = JSON.parse(fileContent)

          console.log(jsonContent)

          if (jsonContent && jsonContent.title) {
            acc[dirName] = jsonContent.title
          } else {
            acc[dirName] = null // JSONが正しくてもtitleがない場合
          }
        } catch (e) {
          console.log(e)
          acc[dirName] = null // JSONが正しくない場合
        }
      } else {
        acc[dirName] = null // ファイルがない場合
      }
    }
    return acc
  }, {})

  return fileDirList
}


