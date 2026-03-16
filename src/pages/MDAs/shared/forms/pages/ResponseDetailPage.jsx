import { ArrowUpRight } from 'iconoir-react';
import { Icons } from '../components/Icons';
import { FORM_THEMES } from '../components/ThemeSelector';

export function ResponseDetailPage({ response, form, onBack }) {
  if (!response || !form) return null;

  // Export single response as CSV
  const exportSingleResponse = () => {
    try {
      // Create CSV headers
      const headers = ['Field', 'Response', 'Type'];

      // Create CSV rows
      const csvRows = [];

      // Add header row
      csvRows.push(headers.join(','));

      // Add response data rows
      form.fields.forEach((field) => {
        const fieldValue = response.data[field.id] || '';
        let displayValue = fieldValue;

        // Handle different field types
        if (Array.isArray(fieldValue)) {
          displayValue = fieldValue.join('; ');
        } else if (typeof fieldValue === 'object' && fieldValue !== null) {
          // File upload object
          displayValue =
            fieldValue.url ||
            fieldValue.documentUrl ||
            fieldValue.name ||
            JSON.stringify(fieldValue);
        } else if (field.type === 'file' && typeof fieldValue === 'string') {
          // File upload string (direct URL)
          displayValue = fieldValue;
        }

        // Escape quotes and commas in the value
        displayValue = String(displayValue).replace(/"/g, '""');
        const fieldLabel = String(field.label || field.type).replace(/"/g, '""');

        csvRows.push(`"${fieldLabel}","${displayValue}","${field.type}"`);
      });

      // Add metadata rows
      csvRows.push(',,,,');
      csvRows.push(
        '"Submitted By","' + response.data.fullname.replace(/"/g, '""') + '","Metadata"'
      );
      csvRows.push(
        '"Submitted At","' +
          new Date(response.createdAt).toLocaleString().replace(/"/g, '""') +
          '","Metadata"'
      );
      csvRows.push('"Response ID","' + response._id.replace(/"/g, '""') + '","Metadata"');
      csvRows.push('"Form Title","' + form.title.replace(/"/g, '""') + '","Metadata"');

      // Create and download CSV file
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `${response.createdAt.replace(/[^a-z0-9]/gi, '_')}_${form.title.replace(/[^a-z0-9]/gi, '_')}_response.csv`
      );
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export response. Please try again.');
    }
  };

  // Get form theme for banner styling
  const currentTheme = FORM_THEMES[form?.theme] || FORM_THEMES.green;

  const renderValue = (field, value) => {
    if (!value) return <span className="text-gray-400 italic">No response</span>;

    if (field.type === 'file') {
      const fileData = typeof value === 'string' ? { url: value, name: 'View File' } : value;
      return (
        <a
          href={fileData?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600! font-medium hover:underline flex items-center gap-1"
        >
          📎 {fileData?.name || 'View File'}
          <ArrowUpRight className="text-[10px] ml-[2px]" />
        </a>
      );
    }

    if (Array.isArray(value))
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((v, i) => (
            <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
              {v}
            </span>
          ))}
        </div>
      );

    return <span className="text-gray-900">{value}</span>;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-medium mb-6"
      >
        <Icons.Back /> Back to Responses
      </button>

      <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
        {/* Banner */}
        <div className={`px-6 py-4 bg-gradient-to-r ${currentTheme.gradient}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-lg">{response.data.fullname}'s Response</h2>
              <p className="text-white/90 text-sm">
                {form.title} · Submitted{' '}
                {new Date(response.createdAt).toLocaleDateString('en-NG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <button
              onClick={exportSingleResponse}
              className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg text-sm font-medium hover:bg-white/30 transition-colors border border-white/30"
            >
              <Icons.Download />
              Export
            </button>
          </div>
        </div>

        {/* Field values */}
        <div className="divide-y divide-gray-100">
          {form.fields.map((field) => (
            <div key={field.id} className="px-6 py-4">
              <p className="text-xs font-medium text-gray-500 mb-1">
                {field.label}
                {field.required && <span className="text-red-400 ml-0.5">*</span>}
              </p>
              <div className="text-sm">{renderValue(field, response.data[field.id])}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
