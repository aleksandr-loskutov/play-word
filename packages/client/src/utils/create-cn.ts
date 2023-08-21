import { withNaming } from '@bem-react/classname'

const preset = { e: '__', m: '_', v: '_' }
const baseCn = withNaming(preset)

const createCn = (block: string) => (element?: string, modifier?: any) => {
  return baseCn(block, element)(modifier)
}

export default createCn
