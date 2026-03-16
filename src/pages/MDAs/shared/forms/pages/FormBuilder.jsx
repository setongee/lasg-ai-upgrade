import { useState } from 'react';
import { useThemeStore } from '../../../stores/theme.store';
import { FieldEditor } from '../components/FieldEditor';
import { Icons } from '../components/Icons';
import FormsThemeSelector from '../components/ThemeSelector';
import { FIELD_TYPES, hasOptions } from '../utils/fieldTypes';

export function FormBuilder({ form, onSave, onCancel }) {
  const [title, setTitle] = useState(form?.title || '');
  const [desc, setDesc] = useState(form?.description || '');
  const [fields, setFields] = useState(() => {
    if (form?.fields) return form.fields;
    // Default mandatory fields for new forms
    return [
      {
        id: 'fullname',
        type: 'short_answer',
        label: 'Full Name',
        required: true,
        isMandatory: true,
      },
      {
        id: 'email',
        type: 'short_answer',
        label: 'Email Address',
        required: true,
        isMandatory: true,
      },
    ];
  });
  const [dragIdx, setDragIdx] = useState(null);
  const [saving, setSaving] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(form?.theme || 'green');
  const mda = useThemeStore((state) => state.mdaData)?.slug;

  const addField = (type) => {
    const f = { id: `f_${Date.now()}`, type, label: '', required: false };
    if (hasOptions(type)) f.options = ['Option 1', 'Option 2'];
    setFields([...fields, f]);
  };

  const moveField = (idx, dir) => {
    const ni = idx + dir;
    if (ni < 0 || ni >= fields.length) return;
    const nf = [...fields];
    [nf[idx], nf[ni]] = [nf[ni], nf[idx]];
    setFields(nf);
  };

  const duplicateField = (idx) => {
    const copy = {
      ...fields[idx],
      id: `f_${Date.now()}`,
      label: `${fields[idx].label} (copy)`,
      options: fields[idx].options ? [...fields[idx].options] : undefined,
    };
    const nf = [...fields];
    nf.splice(idx + 1, 0, copy);
    setFields(nf);
  };

  const handleDragStart = (e, idx) => {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIdx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === targetIdx) return;
    const nf = [...fields];
    const [moved] = nf.splice(dragIdx, 1);
    nf.splice(targetIdx, 0, moved);
    setFields(nf);
    setDragIdx(null);
  };

  const handleSave = async () => {
    if (!title.trim()) return alert('Please enter a form title');
    if (fields.length === 0) return alert('Add at least one field');
    if (fields.some((f) => !f.label.trim())) return alert('All fields must have a label');
    setSaving(true);
    try {
      await onSave({ title, description: desc, fields, theme: selectedTheme, mda });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onCancel}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-medium"
        >
          <Icons.Back /> Back to Forms
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : form ? 'Update Form' : 'Create Form'}
        </button>
      </div>

      {/* Title / description */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Form Title"
          className="w-full text-2xl font-bold text-gray-900 border-none outline-none placeholder-gray-300 mb-2"
        />
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Form description (optional)"
          className="w-full text-sm text-gray-600 border-none outline-none placeholder-gray-300"
        />
      </div>

      {/* Theme Selector */}
      <FormsThemeSelector
        selectedTheme={selectedTheme}
        onThemeChange={setSelectedTheme}
        className="mb-6"
      />

      {/* Fields */}
      <div className="space-y-4 mb-6">
        {fields.map((field, i) => (
          <div key={field.id} className="relative group">
            <FieldEditor
              field={field}
              index={i}
              total={fields.length}
              onChange={(upd) => {
                const nf = [...fields];
                // Ensure mandatory fields stay mandatory and required
                if (field.isMandatory) {
                  upd.isMandatory = true;
                  upd.required = true;
                }
                nf[i] = upd;
                setFields(nf);
              }}
              onDelete={
                field.isMandatory
                  ? undefined
                  : () => setFields(fields.filter((_, idx) => idx !== i))
              }
              onMove={moveField}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              isDragging={dragIdx === i}
            />
            <button
              onClick={() => duplicateField(i)}
              className="absolute top-3 right-24 p-1 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Duplicate"
            >
              <Icons.Copy />
            </button>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {fields.length === 0 && (
        <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl mb-6">
          <p className="text-lg mb-1">No fields yet</p>
          <p className="text-sm">Add your first field using the buttons below</p>
        </div>
      )}

      {/* Add field toolbar */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
        <p className="text-xs font-medium text-gray-500 mb-3">ADD FIELD</p>
        <div className="flex flex-wrap gap-2">
          {FIELD_TYPES.map((ft) => (
            <button
              key={ft.type}
              onClick={() => addField(ft.type)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-700 hover:border-gray-300 hover:text-white transition-colors"
            >
              <span className="text-base">{ft.icon}</span> {ft.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
