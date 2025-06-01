export const getChangeColor = (change: number): string => {
  // Clamp the change value between -100 and 100
  const clamped = Math.max(-100, Math.min(100, change));

  // Normalize to [0, 1]: -100 maps to 0 (red), 100 maps to 1 (green)
  const norm = (clamped + 100) / 200;

  // Calculate hue: interpolate from 120° (green) to 0° (red)
  // Going from 120 to 0 ensures we avoid orange (30°–60°)
  const hue = 120 * norm;

  // Keep saturation and lightness constant for bright, vivid colors
  const saturation = 100; // 100% saturation for vivid colors
  const lightness = 50;   // 50% lightness for maximum brightness

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s; // Chroma
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) {
      r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
      r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
      r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
      r = x; g = 0; b = c;
    } else if (h >= 300 && h < 360) {
      r = c; g = 0; b = x;
    }

    // Scale to [0, 255] and add m
    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255)
    ];
  };

  // Convert RGB to hex
  const toHex = (c: number): string => Math.round(c).toString(16).padStart(2, '0').toUpperCase();

  // Get RGB values from HSL
  const [r, g, b] = hslToRgb(hue, saturation, lightness);

  // Return hex color
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};