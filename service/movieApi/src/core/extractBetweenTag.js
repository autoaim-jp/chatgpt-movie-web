import { mod, store } from './init.js'
export default {}

export const extractBetweenTag = ({ str }) => {
  const regex = /# ===\n([\s\S]*?)# ===/
  const match = str.match(regex)
  return match ? match[1].trim() : ''
}

