// Form theme presets
const FORM_THEMES = {
  green: {
    name: 'Default Green',
    primary: 'green',
    gradient: 'from-green-600 to-emerald-600',
    focus: 'ring-green-400',
    border: 'border-green-300',
    bg: 'bg-green-50',
    text: 'text-green-600',
    hover: 'hover:bg-green-100',
  },
  blue: {
    name: 'Blue',
    primary: 'blue',
    gradient: 'from-blue-600 to-blue-700',
    focus: 'ring-blue-400',
    border: 'border-blue-300',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    hover: 'hover:bg-blue-100',
  },
  purple: {
    name: 'Purple',
    primary: 'purple',
    gradient: 'from-purple-600 to-indigo-600',
    focus: 'ring-purple-400',
    border: 'border-purple-300',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    hover: 'hover:bg-purple-100',
  },
  orange: {
    name: 'Orange',
    primary: 'orange',
    gradient: 'from-orange-600 to-red-600',
    focus: 'ring-orange-400',
    border: 'border-orange-300',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    hover: 'hover:bg-orange-100',
  },
  teal: {
    name: 'Teal',
    primary: 'teal',
    gradient: 'from-teal-600 to-cyan-600',
    focus: 'ring-teal-400',
    border: 'border-teal-300',
    bg: 'bg-teal-50',
    text: 'text-teal-600',
    hover: 'hover:bg-teal-100',
  },
};

export { FORM_THEMES };

export function FormsThemeSelector({ selectedTheme, onThemeChange, className = '' }) {
  return (
    <div className={`bg-white rounded-xl border-2 border-gray-200 p-6 ${className}`}>
      <h3 className="text-[15px] font-semibold text-gray-900 mb-1">Form Theme</h3>
      <p className="text-[13px] text-gray-500 mb-8">Choose a color theme for your form</p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries(FORM_THEMES).map(([key, theme]) => (
          <button
            key={key}
            onClick={() => onThemeChange(key)}
            className={`relative p-4 rounded-lg border-[1.5px] transition-all ${
              selectedTheme === key
                ? 'border-gray-400 shadow-xs'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`w-full h-8 rounded bg-gradient-to-r ${theme.gradient} mb-2`}></div>
            <p className="text-xs font-medium text-gray-700">{theme.name}</p>
            {selectedTheme === key && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-[14px] text-gray-600">
          <strong>Preview:</strong> The selected theme will be applied to your{' '}
          <strong>form's header</strong>, <strong>buttons</strong>, and{' '}
          <strong>interactive elements</strong>.
        </p>
      </div>
    </div>
  );
}

export default FormsThemeSelector;
