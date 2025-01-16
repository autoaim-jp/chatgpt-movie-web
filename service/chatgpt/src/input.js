const mod = {}

const init = ({ fs }) => {
  mod.fs = fs
}

const readFile = ({ filePath }) => {
  return fs.readFileSync(filePath, 'utf-8')
}

export default {
  init,
  readFile,
}

