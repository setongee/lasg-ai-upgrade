import { useState } from 'react';
import { Icons } from '../components/Icons';
import { FORM_THEMES } from '../components/ThemeSelector';

export function FormPreviewPage({ form, onClose }) {
  const [vals, setVals] = useState({});

  // Get the current theme or default to green
  const currentTheme = FORM_THEMES[form?.theme] || FORM_THEMES.green;

  const setVal = (id, v) => setVals({ ...vals, [id]: v });

  const toggleCheckbox = (fieldId, opt) => {
    const cur = vals[fieldId] || [];
    setVal(fieldId, cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt]);
  };

  return (
    <>
      <div
        className={`fixed w-screen h-screen top-0 left-0 ${currentTheme.bg} opacity-50 z-1`}
      ></div>
      <div className="max-w-3xl mx-auto relative z-2">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            <Icons.Back /> Back
          </button>
          <span className="text-xs font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
            Preview Mode
          </span>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
          {/* Banner */}
          <div className={`px-6 py-5 bg-gradient-to-r ${currentTheme.gradient}`}>
            <h2 className="text-white font-bold text-xl">{form.title || 'Untitled Form'}</h2>
            {form.description && <p className="text-white/90 text-sm mt-1">{form.description}</p>}
          </div>

          {/* Fields */}
          <div className="p-6 space-y-5">
            {(form.fields || []).map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-800 mb-1.5">
                  {field.label || 'Untitled'}
                  {field.required && <span className="text-red-500 ml-0.5">*</span>}
                </label>

                {field.type === 'short_answer' && (
                  <input
                    value={vals[field.id] || ''}
                    onChange={(e) => setVal(field.id, e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 ${currentTheme.focus}`}
                    placeholder="Short answer"
                  />
                )}

                {field.type === 'long_answer' && (
                  <textarea
                    value={vals[field.id] || ''}
                    onChange={(e) => setVal(field.id, e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 ${currentTheme.focus} resize-none`}
                    placeholder="Long answer"
                  />
                )}

                {field.type === 'dropdown' && (
                  <select
                    value={vals[field.id] || ''}
                    onChange={(e) => setVal(field.id, e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 ${currentTheme.focus}`}
                  >
                    <option value="">Select an option</option>
                    {(field.options || []).map((o, i) => (
                      <option key={i} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === 'multi_select' && (
                  <select
                    multiple
                    value={vals[field.id] || []}
                    onChange={(e) =>
                      setVal(
                        field.id,
                        Array.from(e.target.selectedOptions, (o) => o.value)
                      )
                    }
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 ${currentTheme.focus}`}
                    style={{ minHeight: 80 }}
                  >
                    {(field.options || []).map((o, i) => (
                      <option key={i} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === 'radio' && (
                  <div className="space-y-2">
                    {(field.options || []).map((o, i) => (
                      <label
                        key={i}
                        className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={field.id}
                          value={o}
                          checked={vals[field.id] === o}
                          onChange={() => setVal(field.id, o)}
                          className={`text-${currentTheme.primary}-600 focus:ring-${currentTheme.primary}-400`}
                        />
                        {o}
                      </label>
                    ))}
                  </div>
                )}

                {field.type === 'checkbox' && (
                  <div className="space-y-2">
                    {(field.options || []).map((o, i) => (
                      <label
                        key={i}
                        className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={(vals[field.id] || []).includes(o)}
                          onChange={() => toggleCheckbox(field.id, o)}
                          className={`rounded text-${currentTheme.primary}-600 focus:ring-${currentTheme.primary}-400`}
                        />
                        {o}
                      </label>
                    ))}
                  </div>
                )}

                {field.type === 'file' && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-sm text-gray-500">
                    <p>📎 Click or drag to upload a file</p>
                    <p className="text-xs mt-1 text-gray-400">
                      Ensure your file does not exceed 10MB
                    </p>
                  </div>
                )}
              </div>
            ))}

            <button
              className={`w-full py-2.5 bg-gradient-to-r ${currentTheme.gradient} text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity`}
            >
              Submit (Preview Only)
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
