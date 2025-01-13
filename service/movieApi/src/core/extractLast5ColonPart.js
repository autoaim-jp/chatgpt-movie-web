import { mod, store } from './init.js'
export default {}

export const extractLast5ColonPart = ({ str }) => {
  const lineList = str.split('\n').filter(line => line.includes(':'))
  const last5LineList = lineList.slice(-5)
  return last5LineList.map(line => line.split(':').slice(1).join(':').trim())
}

