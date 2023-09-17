// Function to convert RGB to HSL
const rgbToHSL = ([r, g, b]: number[]): [number, number, number] => {
  const rNormalized = r / 255.0;
  const gNormalized = g / 255.0;
  const bNormalized = b / 255.0;

  const max = Math.max(rNormalized, gNormalized, bNormalized);
  const min = Math.min(rNormalized, gNormalized, bNormalized);

  let h;
  let s;
  const l = (max + min) / 2.0;

  if (max === min) {
    h = 0;
    s = 0;
  } else {
    const diff = max - min;
    s = l > 0.5 ? diff / (2.0 - max - min) : diff / (max + min);
    if (max === rNormalized) {
      h =
        (gNormalized - bNormalized) / diff +
        (gNormalized < bNormalized ? 6 : 0);
    } else if (max === gNormalized) {
      h = (bNormalized - rNormalized) / diff + 2;
    } else {
      h = (rNormalized - gNormalized) / diff + 4;
    }
    h *= 60;
  }

  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
};

// Function to convert HSL to RGB
const hslToRGB = ([h, s, l]: [number, number, number]): [
  number,
  number,
  number
] => {
  const sNormalized = s / 100;
  const lNormalized = l / 100;

  const c = (1 - Math.abs(2 * lNormalized - 1)) * sNormalized;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNormalized - c / 2;

  let [r, g, b] = [0, 0, 0];

  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else if (h >= 300 && h < 360) {
    [r, g, b] = [c, 0, x];
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return [r, g, b];
};

const rgbToHex = (rgb: number[]): string =>
  `#${rgb.map((x) => x.toString(16).padStart(2, '0')).join('')}`;

// Function to convert HSL to Hex
const hslToHex = (hsl: [number, number, number]): string => {
  const rgb = hslToRGB(hsl);
  return rgbToHex(rgb);
};

// Function to adjust lightness in HSL model
const adjustLightness = (
  [h, s, l]: [number, number, number],
  adjustment: number
): [number, number, number] => {
  const newL = Math.min(100, Math.max(0, l + adjustment)); // Clamp to [0, 100]
  return [h, s, newL];
};

const hexToRGB = (hex: string): number[] => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

const getLuminance = (hex: string): number => {
  const rgb = hexToRGB(hex);
  const [r, g, b] = rgb;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

const getRandomColor = (): string =>
  `#${Array.from({ length: 6 })
    .map(() => '0123456789ABCDEF'[Math.floor(Math.random() * 16)])
    .join('')}`;

const getInitials = (name: string): string | null => {
  const nameSplit = name.split(' ').filter(Boolean); // Filter out empty strings
  const [first, last] = [nameSplit[0], nameSplit[nameSplit.length - 1]];

  if (!first) return null; // Return null if no valid names

  // Return only first character if there's only one word
  if (nameSplit.length === 1) {
    return first[0].toUpperCase();
  }

  // Else, return the first characters of the first and last words
  return `${first[0]}${last[0]}`.toUpperCase();
};

export default function createImageFromInitials(
  name: string,
  size: number = 100,
  color: string = getRandomColor()
): string | null {
  if (!name) return null;

  const initials = getInitials(name);
  if (!initials) return null;

  // Initialize canvas and context
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  canvas.width = size;
  canvas.height = size;

  const luminance = getLuminance(color);

  let textColor = color; // Default text color

  if (luminance < 0.4) {
    // If the luminance is too low, adjust the text color
    const hsl = rgbToHSL(hexToRGB(color));
    const adjustedHSL = adjustLightness(hsl, 30); // Increase lightness by 30%
    textColor = hslToHex(adjustedHSL); // Convert back to hex
  }

  // Setting up canvas background
  context.fillStyle = 'transparent';
  context.fillRect(0, 0, size, size);

  // Fill rectangle with semi-transparent color
  context.fillStyle = `${color}25`;
  context.fillRect(0, 0, size, size);

  // Glow effect setup
  context.shadowColor = textColor;
  context.shadowBlur = 10;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;

  // Fill text
  context.fillStyle = textColor; // Use calculated text color
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.font = `${size / 2}px Roboto`;
  context.fillText(initials, size / 2, size / 2);

  return canvas.toDataURL();
}
