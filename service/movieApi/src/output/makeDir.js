import { mod } from './init.js'
export default {}

export const makeDir = ({ dirPath }) => {
  return mod.fs.mkdirSync(dirPath, { recursive: true })
}

