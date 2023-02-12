import { withNaming } from '@bem-react/classname';

const createCn = (block: string) => (element?: string, modifier?: any) => {
  const preset = { e: '__', m: '_', v: '_' };
  const baseCn = withNaming(preset);

  return baseCn(block, element)(modifier);
};

export default createCn;
