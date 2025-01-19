import { mod, store } from './init.js'
export default {}

export const extractFirstColonPart = ({ str }) => {
  const lines = str.split('\n')
  const firstColonLine = lines.find(line => line.includes(':'))
  return firstColonLine ? firstColonLine.split(':').slice(1).join(':').trim() : null
}

