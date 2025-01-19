import { mod } from './init.js'
export default {}

export const copyFile = ({ filePathFrom, filePathTo }) => {
  mod.fs.copyFileSync(filePathFrom, filePathTo)
}

