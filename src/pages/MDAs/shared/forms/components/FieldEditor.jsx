import { FIELD_TYPES, hasOptions } from '../utils/fieldTypes';
import { Icons } from './Icons';

export function FieldEditor({
  field,
  index,
  total,
  onChange,
  onDelete,
  onMove,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
}) {
  const updateField = (key, value) => onChange({ ...field, [key]: value });

  const updateOption = (i, val) => {
    const opts = [...(field.options || [])];
    opts[i] = val;
    updateField('options', opts);
  };

  const addOption = () =>
    updateField('options', [
      ...(field.options || []),
      `Option ${(field.options?.length || 0) + 1}`,
    ]);

  const removeOption = (i) =>
    updateField(
      'options',
      field.options.filter((_, idx) => idx !== i)
    );

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      className={`bg-white rounded-xl border-2 transition-all ${
        isDragging ? 'border-gray-400 opacity-50 scale-95' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl">
        <span className="cursor-grab text-gray-400 hover:text-gray-600">
          <Icons.Grip />
        </span>
        <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
          {index + 1}
        </span>
        <span className="text-xs text-gray-500 flex-1">
          {FIELD_TYPES.find((ft) => ft.type === field.type)?.label}
        </span>
        <button
          onClick={() => onMove(index, -1)}
          disabled={index === 0}
          className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
        >
          <Icons.Up />
        </button>
        <button
          onClick={() => onMove(index, 1)}
          disabled={index === total - 1}
          className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
        >
          <Icons.Down />
        </button>
        {onDelete && (
          <button onClick={onDelete} className="p-1 text-red-400 hover:text-red-600">
            <Icons.Trash />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Question Label</label>
            <input
              value={field.label}
              onChange={(e) => updateField('label', e.target.value)}
              placeholder="Enter question..."
              disabled={field.isMandatory}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent ${
                field.isMandatory
                  ? 'bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200'
                  : 'border-gray-300'
              }`}
            />
          </div>
          <div className="w-40">
            <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
            <select
              value={field.type}
              disabled={field.isMandatory}
              onChange={(e) => {
                const newType = e.target.value;
                const upd = { ...field, type: newType };
                if (hasOptions(newType) && !upd.options) upd.options = ['Option 1', 'Option 2'];
                onChange(upd);
              }}
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                field.isMandatory
                  ? 'bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200'
                  : 'border-gray-300'
              }`}
            >
              {FIELD_TYPES.map((ft) => (
                <option key={ft.type} value={ft.type}>
                  {ft.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Options editor */}
        {hasOptions(field.type) && (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Options</label>
            <div className="space-y-2">
              {(field.options || []).map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs w-4">
                    {field.type === 'radio' ? '◯' : field.type === 'checkbox' ? '☐' : '•'}
                  </span>
                  <input
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                  {(field.options?.length || 0) > 1 && (
                    <button
                      onClick={() => removeOption(i)}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      <Icons.Trash />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addOption}
                className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1 mt-1"
              >
                <Icons.Plus /> <span>Add option</span>
              </button>
            </div>
          </div>
        )}

        {field.type === 'file' && (
          <p className="text-[13px] text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
            Ensure your file does not exceed 10MB
          </p>
        )}

        <label
          className={`flex items-center gap-2 text-sm ${
            field.isMandatory ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600'
          }`}
        >
          <input
            type="checkbox"
            checked={field.required || false}
            disabled={field.isMandatory}
            onChange={(e) => updateField('required', e.target.checked)}
            className={`rounded border-gray-300 text-gray-600 focus:ring-gray-400 ${
              field.isMandatory ? 'cursor-not-allowed' : ''
            }`}
          />
          Required {field.isMandatory && '(Mandatory)'}
        </label>
      </div>
    </div>
  );
}
