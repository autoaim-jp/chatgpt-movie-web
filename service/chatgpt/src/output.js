const mod = {}

const init = ({ fs }) => {
  mod.fs = fs
}

const mkdir = ({ dirPath }) => {
  fs.mkdirSync(dirPath, { recursive: 'true' })
}

const saveFile = ({ filePath, content }) => {
  fs.writeFileSync(filePath, content)
}

export default {
  init,
  mkdir,
  saveFile,
}

