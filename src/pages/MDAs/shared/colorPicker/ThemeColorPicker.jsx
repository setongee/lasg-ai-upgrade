import { useState } from 'react';
import { COLOR_PRESETS, GRADIENT_PRESETS } from '../utils/colorTheme';

const TABS = [
  { key: 'preset', label: 'Solid' },
  { key: 'gradient', label: 'Gradient' },
  { key: 'custom', label: 'Custom' },
];

// Site-wide color theme picker — solid presets, gradient presets, or a
// custom color-wheel pick. `value` is `{ mode, color, gradientEnd }`;
// `onChange` receives the same shape.
const ThemeColorPicker = ({ value, onChange }) => {
  const mode = value?.mode || 'preset';
  const [activeTab, setActiveTab] = useState(mode);

  const selectTab = (tab) => {
    setActiveTab(tab);
  };

  const appearance = value?.appearance === 'dark' ? 'dark' : 'light';

  const selectPreset = (color) => {
    onChange({ ...value, mode: 'preset', color, gradientEnd: '' });
  };

  const selectGradient = (preset) => {
    onChange({ ...value, mode: 'gradient', color: preset.color, gradientEnd: preset.gradientEnd });
  };

  const selectCustom = (color) => {
    onChange({ ...value, mode: 'custom', color, gradientEnd: '' });
  };

  const selectAppearance = (next) => {
    onChange({ ...value, appearance: next });
  };

  return (
    <div>
      <div className="mb-4">
        <span className="text-[13px] font-medium text-gray-700 block mb-2">Appearance</span>
        <div className="flex gap-1 p-1 bg-gray-100 rounded-[8px]">
          {[
            { key: 'light', label: 'Light' },
            { key: 'dark', label: 'Dark' },
          ].map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => selectAppearance(option.key)}
              className={`flex-1 py-2 text-[13px] font-medium rounded-[6px] transition-colors ${
                appearance === option.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-1 p-1 bg-gray-100 rounded-[8px] mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => selectTab(tab.key)}
            className={`flex-1 py-2 text-[13px] font-medium rounded-[6px] transition-colors ${
              activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'preset' && (
        <div className="grid grid-cols-4 gap-3">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => selectPreset(preset.value)}
              title={preset.label}
              className={`flex flex-col items-center gap-1.5 ${
                mode === 'preset' && value?.color === preset.value ? '' : ''
              }`}
            >
              <span
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  mode === 'preset' && value?.color === preset.value
                    ? 'border-gray-800 scale-110'
                    : 'border-gray-200'
                }`}
                style={{ backgroundColor: preset.value }}
              />
              <span className="text-[11px] text-gray-500">{preset.label}</span>
            </button>
          ))}
        </div>
      )}

      {activeTab === 'gradient' && (
        <div className="grid grid-cols-3 gap-3">
          {GRADIENT_PRESETS.map((preset) => {
            const isSelected =
              mode === 'gradient' &&
              value?.color === preset.color &&
              value?.gradientEnd === preset.gradientEnd;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => selectGradient(preset)}
                title={preset.label}
                className="flex flex-col items-center gap-1.5"
              >
                <span
                  className={`w-full h-12 rounded-[8px] border-2 transition-all ${
                    isSelected ? 'border-gray-800 scale-105' : 'border-gray-200'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${preset.color}, ${preset.gradientEnd})`,
                  }}
                />
                <span className="text-[11px] text-gray-500">{preset.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {activeTab === 'custom' && (
        <div className="flex flex-col items-center gap-3 py-4">
          <label
            className="w-16 h-16 rounded-full border-2 border-gray-200 cursor-pointer relative overflow-hidden"
            style={{ background: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)' }}
          >
            <input
              type="color"
              value={mode === 'custom' ? value?.color || '#00b44e' : '#00b44e'}
              onChange={(e) => selectCustom(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>
          <span className="text-xs text-gray-500 uppercase">
            {mode === 'custom' ? value?.color : 'Pick a color'}
          </span>
        </div>
      )}
    </div>
  );
};

export default ThemeColorPicker;
