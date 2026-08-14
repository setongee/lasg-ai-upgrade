import { PRESET_COLORS } from './backgroundColorPresets';

// Reusable "Background Color" control for every section's edit sidebar —
// preset swatches + a native color-wheel input. `value` is the section's own
// explicit hex, or empty/undefined to inherit the site theme's pastel
// default. `onChange` receives the new hex, or '' to clear back to that
// theme default — never a literal white, so "no explicit color" stays a
// real, distinct state rather than silently pinning white forever.
const BackgroundColorPicker = ({ value, onChange }) => {
  const hasCustomColor = !!value;
  const swatchColor = value || 'var(--theme-section-bg, #ffffff)';

  return (
    <div className="py-[20px] px-[30px] border-b border-gray-200">
      <span className="text-sm font-medium text-gray-700 block mb-3">Background Color</span>

      <div className="flex flex-wrap gap-2.5 mb-3">
        {PRESET_COLORS.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => onChange(preset.value)}
            title={preset.label}
            className={`w-7 h-7 rounded-full border-2 transition-all ${
              hasCustomColor && value.toLowerCase() === preset.value
                ? 'border-green-600 scale-110'
                : 'border-gray-200'
            }`}
            style={{ backgroundColor: preset.value }}
          />
        ))}

        {/* Custom color wheel */}
        <label
          title="Custom color"
          className="w-7 h-7 rounded-full border-2 border-gray-200 cursor-pointer relative overflow-hidden"
          style={{ background: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)' }}
        >
          <input
            type="color"
            value={hasCustomColor ? value : '#ffffff'}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </label>
      </div>

      <div className="flex items-center gap-2">
        <span
          className="w-4 h-4 rounded border border-gray-200"
          style={{ backgroundColor: swatchColor }}
        />
        <span className="text-xs text-gray-500 uppercase">
          {hasCustomColor ? value : 'Theme default'}
        </span>
        {hasCustomColor && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-gray-400 hover:text-gray-600 underline ml-1"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default BackgroundColorPicker;
