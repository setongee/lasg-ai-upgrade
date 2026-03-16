import { useQuery } from '@tanstack/react-query';
import { PcNoEntry } from 'iconoir-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { api } from './api/index';
import { FORM_THEMES } from './components/ThemeSelector';

// ─── LIVE FORM PAGE ───
// Public-facing form that validates and submits via api.submitForm().
// Props:
//   form    – the form object to render
//   onBack  – () => void  (optional – omit for a truly public standalone page)
export default function LiveForm({ onBack }) {
  const [vals, setVals] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(null);
  const [uploadingFiles, setUploadingFiles] = useState({}); // Track upload progress
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['forms'],
    queryFn: () => api.getFormById(id),
  });

  useEffect(() => {
    if (data) {
      setForm(data?.data);
    }
  }, [data]);

  if (isLoading)
    return (
      <div className="h-screen w-full flex items-center justify-center"> Loading form... </div>
    );

  if (!form)
    return (
      <div className="h-screen w-full flex justify-center items-center flex-col gap-3">
        {' '}
        <PcNoEntry /> Sorry this form doesn't exist!{' '}
      </div>
    );

  // Get the current theme or default to green
  const currentTheme = FORM_THEMES[form?.theme] || FORM_THEMES.green;

  // ── Value helpers ──
  const setVal = (id, v) => {
    setVals((prev) => ({ ...prev, [id]: v }));
    // Clear error on change
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: null }));
  };

  const toggleCheckbox = (fieldId, opt) => {
    const cur = vals[fieldId] || [];
    setVal(fieldId, cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt]);
  };

  const handleFileChange = async (fieldId, file) => {
    if (!file) return;

    // Set initial upload state
    setUploadingFiles((prev) => ({
      ...prev,
      [fieldId]: { progress: 0, status: 'uploading' },
    }));

    try {
      // Simulate progress updates since uploadDocument doesn't support progress callback yet
      const progressInterval = setInterval(() => {
        setUploadingFiles((prev) => {
          const currentProgress = prev[fieldId]?.progress || 0;
          if (currentProgress < 90) {
            return {
              ...prev,
              [fieldId]: { progress: currentProgress + 10, status: 'uploading' },
            };
          }
          return prev;
        });
      }, 200);

      const result = await api.uploadFile(file, `form-uploads/${form?.mda}`);

      clearInterval(progressInterval);
      setVal(fieldId, result);
      setUploadingFiles((prev) => ({
        ...prev,
        [fieldId]: { progress: 100, status: 'completed' },
      }));

      // Clean up after a short delay
      setTimeout(() => {
        setUploadingFiles((prev) => {
          const newFiles = { ...prev };
          delete newFiles[fieldId];
          return newFiles;
        });
      }, 2000);
    } catch {
      setErrors((prev) => ({ ...prev, [fieldId]: 'File upload failed. Please try again.' }));
      setUploadingFiles((prev) => ({
        ...prev,
        [fieldId]: { progress: 0, status: 'failed' },
      }));
    }
  };

  // ── Validation ──
  const validate = () => {
    const newErrors = {};
    for (const field of form.fields) {
      if (!field.required) continue;
      const val = vals[field.id];
      const isEmpty =
        val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0);
      if (isEmpty) newErrors[field.id] = 'This field is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ──
  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await api.submitForm(form._id, { data: vals });
      setSubmitted(true);
    } catch {
      alert('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ──
  if (submitted) {
    return (
      <div className="w-full h-full py-20 mt-25 pb-70">
        <div
          className={`fixed w-screen h-screen top-0 left-0 ${currentTheme.bg} opacity-50 z-1`}
        ></div>
        <div className="max-w-2xl mx-auto relative z-2">
          <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
            <div className={`px-6 py-5 bg-gradient-to-r ${currentTheme.gradient}`}>
              <h2 className="text-white font-bold text-xl">Form Submitted!</h2>
              <p className="text-white/90 text-sm mt-1">Thank you for your response.</p>
            </div>
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Thank you!</h3>
              <p className="text-gray-600 mb-6">Your form has been successfully submitted.</p>
              {onBack && (
                <button
                  onClick={onBack}
                  className={`px-6 py-2 bg-gradient-to-r ${currentTheme.gradient} text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity`}
                >
                  Back to Forms
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full py-20 mt-25 pb-70">
      <div
        className={`fixed w-screen h-screen top-0 left-0 ${currentTheme.bg} opacity-50 z-1`}
      ></div>
      <div className="max-w-2xl mx-auto relative z-2">
        {/* Top bar */}
        {onBack && (
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Live Form
            </span>
          </div>
        )}
        <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
          {/* Header */}
          <div className={`px-6 py-5 bg-gradient-to-r ${currentTheme.gradient}`}>
            <h2 className="text-white font-bold text-xl">{form.title}</h2>
            {form.description && <p className="text-white/90 text-sm mt-1">{form.description}</p>}
          </div>

          {/* Fields */}
          <div className="p-6 space-y-6">
            {(form.fields || []).map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-800 mb-1.5">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-0.5">*</span>}
                </label>

                {field.type === 'short_answer' && (
                  <input
                    value={vals[field.id] || ''}
                    onChange={(e) => setVal(field.id, e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${currentTheme.focus} ${errors[field.id] ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Your answer"
                  />
                )}

                {field.type === 'long_answer' && (
                  <textarea
                    value={vals[field.id] || ''}
                    onChange={(e) => setVal(field.id, e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${currentTheme.focus} resize-none ${errors[field.id] ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Your answer"
                  />
                )}

                {field.type === 'dropdown' && (
                  <select
                    value={vals[field.id] || ''}
                    onChange={(e) => setVal(field.id, e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 ${currentTheme.focus} ${errors[field.id] ? 'border-red-400' : 'border-gray-300'}`}
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
                  <>
                    <select
                      multiple
                      value={vals[field.id] || []}
                      onChange={(e) =>
                        setVal(
                          field.id,
                          Array.from(e.target.selectedOptions, (o) => o.value)
                        )
                      }
                      className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 ${currentTheme.focus} ${errors[field.id] ? 'border-red-400' : 'border-gray-300'}`}
                      style={{ minHeight: 90 }}
                    >
                      {(field.options || []).map((o, i) => (
                        <option key={i} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-400 mt-1">Hold Ctrl / Cmd to select multiple</p>
                  </>
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
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 transition-colors ${errors[field.id] ? 'border-red-400 bg-red-50' : `border-gray-300 ${currentTheme.hover}`}`}
                  >
                    {vals[field.id] ? (
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${currentTheme.text} flex items-center gap-2`}>
                          📎 {vals[field.id].name}
                        </span>
                        <button
                          onClick={() => setVal(field.id, null)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ) : uploadingFiles[field.id] ? (
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-500">
                            {uploadingFiles[field.id].status === 'uploading'
                              ? 'Uploading...'
                              : 'Processing...'}
                          </span>
                          <span className="text-xs font-medium text-gray-500">
                            {uploadingFiles[field.id].progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ease-out ${
                              uploadingFiles[field.id].status === 'failed'
                                ? 'bg-red-500'
                                : 'bg-green-600'
                            }`}
                            style={{ width: `${uploadingFiles[field.id].progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer block text-center text-sm text-gray-500">
                        <p>📎 Click to upload a file</p>
                        <p className="text-xs mt-1 text-gray-400">or drag and drop</p>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileChange(field.id, e.target.files?.[0])}
                        />
                      </label>
                    )}
                  </div>
                )}

                {/* Inline error */}
                {errors[field.id] && (
                  <p className="text-xs text-red-500 mt-1">{errors[field.id]}</p>
                )}
              </div>
            ))}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`w-full py-2.5 bg-gradient-to-r ${currentTheme.gradient} text-white rounded-lg font-medium text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity`}
            >
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
