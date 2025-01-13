import { mod } from './init.js'
export default {}

export const saveFile = ({ filePath, fileBuffer }) => {
  return mod.fs.writeFileSync(filePath, Buffer.from(fileBuffer))
}

