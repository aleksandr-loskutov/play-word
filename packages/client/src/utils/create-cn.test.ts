import createCn from './create-cn';

describe('createCn', () => {
  const cn = createCn('block');

  describe('without element and modifier', () => {
    it('should return the block name', () => {
      expect(cn()).toBe('block');
    });
  });

  describe('with an element', () => {
    it('should return the block name concatenated with the element name', () => {
      expect(cn('element')).toBe('block__element');
    });
  });

  describe('with an element and modifier', () => {
    it('should return the block and element names concatenated with the modifier when it is true', () => {
      expect(cn('element', { modifier: true })).toBe(
        'block__element block__element_modifier'
      );
    });

    it('should not include the modifier when its value is false', () => {
      expect(cn('element', { modifier: false })).not.toContain('modifier');
    });

    it('should handle multiple modifiers', () => {
      expect(cn('element', { mod1: true, mod2: true })).toBe(
        'block__element block__element_mod1 block__element_mod2'
      );
    });

    it('should skip false modifiers when multiple modifiers are provided', () => {
      expect(cn('element', { mod1: true, mod2: false })).toBe(
        'block__element block__element_mod1'
      );
    });
  });
});
