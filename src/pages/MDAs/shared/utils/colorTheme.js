import { isDarkBackground } from './backgroundContrast';

export const DEFAULT_ACCENT = '#1c3f3a';

const hexToRgb = (hex) => {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
};

const rgbToHsl = ({ r, g, b }) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }

  return { h, s, l };
};

const hueToRgbChannel = (p, q, t) => {
  let tt = t;
  if (tt < 0) tt += 1;
  if (tt > 1) tt -= 1;
  if (tt < 1 / 6) return p + (q - p) * 6 * tt;
  if (tt < 1 / 2) return q;
  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
  return p;
};

const hslToRgb = ({ h, s, l }) => {
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hueToRgbChannel(p, q, h + 1 / 3) * 255),
    g: Math.round(hueToRgbChannel(p, q, h) * 255),
    b: Math.round(hueToRgbChannel(p, q, h - 1 / 3) * 255),
  };
};

const toHex = (n) => n.toString(16).padStart(2, '0');
const rgbToHex = ({ r, g, b }) => `#${toHex(r)}${toHex(g)}${toHex(b)}`;

// Same hue, dialed down to a light tint — used for section backgrounds.
// At very high lightness HSL chroma compresses toward white regardless of
// saturation, so s=0.6/l=0.90 is tuned to stay visibly tinted rather than
// washing out to near-gray.
export const derivePastel = (hex, { saturation = 0.6, lightness = 0.9 } = {}) => {
  const hsl = rgbToHsl(hexToRgb(hex));
  return rgbToHex(hslToRgb({ h: hsl.h, s: saturation, l: lightness }));
};

// Same hue, darkened — used for a button/accent sitting on top of a solid
// accent background (e.g. the newsletter submit button), so it still reads
// as a distinct control rather than disappearing into its own section.
export const deriveShade = (hex, { lightness = 0.28 } = {}) => {
  const hsl = rgbToHsl(hexToRgb(hex));
  return rgbToHex(hslToRgb({ h: hsl.h, s: Math.max(hsl.s, 0.4), l: lightness }));
};

// Same hue, driven near-black instead of near-white — the dark-mode
// counterpart to derivePastel, used for section surfaces sitting on the
// dark-mode page background (mirrors how a pastel tint sits on the light
// page background).
export const deriveDarkSurface = (hex, { saturation = 0.4, lightness = 0.12 } = {}) => {
  const hsl = rgbToHsl(hexToRgb(hex));
  return rgbToHex(hslToRgb({ h: hsl.h, s: saturation, l: lightness }));
};

// Turns a saved `colorTheme` ({ mode, color, gradientEnd, appearance }) into
// the concrete values every consumer needs: a solid accent, readable text for
// that accent, a pastel tint and a dark surface tint for section backgrounds
// (whichever matches `appearance`), a darker shade for buttons-on-accent, a
// page-level background/text pair for the light/dark canvas itself, and
// (gradient mode only) a CSS gradient string for decorative use.
export const deriveThemeVars = (colorTheme) => {
  const accent = colorTheme?.color || DEFAULT_ACCENT;
  const onDark = isDarkBackground(accent);
  const isDarkMode = colorTheme?.appearance === 'dark';

  return {
    accent,
    accentText: onDark ? '#ffffff' : '#111827',
    pastel: derivePastel(accent),
    darkSurface: deriveDarkSurface(accent),
    shade: deriveShade(accent),
    isDarkMode,
    pageBg: isDarkMode ? '#0a0a0a' : '#ffffff',
    pageText: isDarkMode ? '#f5f5f5' : '#111827',
    sectionBg: isDarkMode ? deriveDarkSurface(accent) : derivePastel(accent),
    gradientCss:
      colorTheme?.mode === 'gradient' && colorTheme?.gradientEnd
        ? `linear-gradient(135deg, ${accent}, ${colorTheme.gradientEnd})`
        : null,
  };
};

// Inline-style object for the theme root (`themeHolder`) — every descendant
// can reference these as CSS custom properties (`var(--theme-accent)`, etc.)
// without prop-drilling. Also sets the root's own `backgroundColor`/`color`
// so the light/dark canvas and its default text flip via plain CSS
// inheritance — any element without its own explicit color/background picks
// this up automatically, and an element WITH one (an admin's explicit
// per-section choice) naturally keeps it, satisfying "reverse everything
// except what's been customized" for free.
export const themeCssVars = (colorTheme) => {
  const vars = deriveThemeVars(colorTheme);
  return {
    '--theme-accent': vars.accent,
    '--theme-accent-text': vars.accentText,
    '--theme-pastel': vars.pastel,
    '--theme-dark-surface': vars.darkSurface,
    '--theme-shade': vars.shade,
    '--theme-page-bg': vars.pageBg,
    '--theme-page-text': vars.pageText,
    '--theme-section-bg': vars.sectionBg,
    backgroundColor: 'var(--theme-page-bg)',
    color: 'var(--theme-page-text)',
  };
};

export const COLOR_PRESETS = [
  { label: 'Green', value: '#1c3f3a' },
  { label: 'Blue', value: '#2563eb' },
  { label: 'Purple', value: '#7c3aed' },
  { label: 'Red', value: '#dc2626' },
  { label: 'Orange', value: '#ea580c' },
  { label: 'Gold', value: '#ca8a04' },
  { label: 'Teal', value: '#0d9488' },
  { label: 'Navy', value: '#1e3a8a' },
];

export const GRADIENT_PRESETS = [
  { label: 'Teal → Blue', color: '#0d9488', gradientEnd: '#2563eb' },
  { label: 'Purple → Pink', color: '#7c3aed', gradientEnd: '#db2777' },
  { label: 'Orange → Red', color: '#ea580c', gradientEnd: '#dc2626' },
  { label: 'Green → Teal', color: '#1c3f3a', gradientEnd: '#0d9488' },
  { label: 'Sunset', color: '#ea580c', gradientEnd: '#db2777' },
  { label: 'Ocean', color: '#2563eb', gradientEnd: '#0d9488' },
];
