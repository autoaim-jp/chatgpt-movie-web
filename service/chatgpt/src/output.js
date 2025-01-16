const mod = {}

const init = ({ fs }) => {
  mod.fs = fs
}

const mkdir = ({ dirPath }) => {
  mod.fs.mkdirSync(dirPath, { recursive: true })
}

const saveFile = ({ filePath, content }) => {
  mod.fs.writeFileSync(filePath, content)
}

export default {
  init,
  mkdir,
  saveFile,
}

