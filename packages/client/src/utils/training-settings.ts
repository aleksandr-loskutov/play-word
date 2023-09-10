export type KeyMapping = {
  [key: string]: {
    [inputChar: string]: string;
  };
};
export const KEY_MAPPINGS: KeyMapping = {
  KeyA: { a: 'ф' },
  KeyB: { b: 'и' },
  KeyC: { c: 'с' },
  KeyD: { d: 'в' },
  KeyE: { e: 'у' },
  KeyF: { f: 'а' },
  KeyG: { g: 'п' },
  KeyH: { h: 'р' },
  KeyI: { i: 'ш' },
  KeyJ: { j: 'о' },
  KeyK: { k: 'л' },
  KeyL: { l: 'д' },
  KeyM: { m: 'ь' },
  KeyN: { n: 'т' },
  KeyO: { o: 'щ' },
  KeyP: { p: 'з' },
  KeyQ: { q: 'й' },
  KeyR: { r: 'к' },
  KeyS: { s: 'ы' },
  KeyT: { t: 'е' },
  KeyU: { u: 'г' },
  KeyV: { v: 'м' },
  KeyW: { w: 'ц' },
  KeyX: { x: 'ч' },
  KeyY: { y: 'н' },
  KeyZ: { z: 'я' },
  BracketLeft: { '': 'х' },
  BracketRight: { '': 'ъ' },
  Quote: { '': 'э' },
  Semicolon: { '': 'ж' },
  Period: { '': 'ю' },
  Comma: { '': 'б' },
  Space: { '': ' ' },
};

export const TRAINING_SETTINGS = {
  wordErrorLimit: 5,
  wordFailsLimit: 3,
  wordErrorCounterBlockingTimeInSec: 1,
  successWordShowTime: 2000,
  errorLetterShowTime: 1000,
  countdownTimeInSec: 60,
  countdownVisualBlocksLimit: 10,
};
