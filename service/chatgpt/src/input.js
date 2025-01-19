const mod = {}

const init = ({ fs }) => {
  mod.fs = fs
}

const readFile = ({ filePath }) => {
  return mod.fs.readFileSync(filePath, 'utf-8')
}

const readFileBuffer = ({ filePath }) => {
  return mod.fs.readFileSync(filePath)
}
export default {
  init,
  readFile,
  readFileBuffer,
}

