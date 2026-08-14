export const HERO_GRADIENT_PRESETS = [
  { id: 'emerald', label: 'Emerald', css: 'linear-gradient(135deg, #0f9b6c 0%, #00484d 100%)' },
  { id: 'ocean', label: 'Ocean', css: 'linear-gradient(135deg, #0575e6 0%, #021b79 100%)' },
  { id: 'sunset', label: 'Sunset', css: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)' },
  { id: 'royal', label: 'Royal Purple', css: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)' },
  { id: 'forest', label: 'Forest', css: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)' },
  { id: 'charcoal', label: 'Charcoal', css: 'linear-gradient(135deg, #232526 0%, #414345 100%)' },
  { id: 'gold', label: 'Gold', css: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)' },
  { id: 'crimson', label: 'Crimson', css: 'linear-gradient(135deg, #a80000 0%, #440000 100%)' },
];

export const DEFAULT_GRADIENT_ID = HERO_GRADIENT_PRESETS[0].id;

export const getGradientCss = (id) =>
  HERO_GRADIENT_PRESETS.find((preset) => preset.id === id)?.css || HERO_GRADIENT_PRESETS[0].css;
