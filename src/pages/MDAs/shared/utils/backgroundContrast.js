// Relative luminance (WCAG) -> pick light or dark text so a custom background
// color (including one picked off a color wheel) stays readable.
export const isDarkBackground = (hex) => {
  if (!hex) return false;
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return false;

  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;

  const toLinear = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

  return luminance < 0.45;
};

// Section builder color pickers default an unset field to plain white, so a
// stored "#ffffff" is almost always that untouched default rather than a
// deliberate admin choice — across every MDA's data, seen far more often than
// a genuine white pick. In dark mode, honoring it verbatim leaves a jarring
// white island on an otherwise dark page, so it's treated as "not customized"
// there and the caller falls back to its own theme-aware default instead.
// Any other stored color (including a deliberate white the admin re-picks
// after this) is left alone.
export const resolveCustomBackground = (customColor, isDarkMode) => {
  if (!customColor) return null;
  if (isDarkMode && customColor.toLowerCase() === '#ffffff') return null;
  return customColor;
};
