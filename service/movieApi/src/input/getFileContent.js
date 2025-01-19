import { mod } from './init.js'
export default {}

export const getFileContent = ({ filePath }) => {
  if (filePath.includes('..')) {
    return Buffer.from('fail')
  }
  try {
    return mod.fs.readFileSync(filePath)
  } catch(e) {
    return null
  }
}

