export default function excludeFields<T, Key extends keyof T>(
  object: T,
  keys: Key[]
): Omit<T, Key> {
  const clone = { ...object };
  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys) {
    // this can be refactored without for, but it's more readable now and does not req types gymnastic
    delete clone[key];
  }
  return clone;
}
