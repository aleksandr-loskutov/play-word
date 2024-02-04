import { KEY_MAPPINGS } from './training-settings';

// todo refactor
function getKeycode(code: string): string | undefined {
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, mapping] of Object.entries(KEY_MAPPINGS)) {
    if (
      Object.keys(mapping).includes(code) ||
      Object.values(mapping).includes(code)
    ) {
      return key;
    }
  }
  return undefined;
}

export default getKeycode;
