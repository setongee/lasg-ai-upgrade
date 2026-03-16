import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { api } from '../api';
import { Icons } from '../components/Icons';

export function ResponsesListPage({ form, onBack, onViewResponse }) {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // data fetching method
  const { data, isLoading, error } = useQuery({
    queryKey: ['forms'],
    queryFn: () => api.getResponses(form._id),
  });

  useEffect(() => {
    if (data) {
      setResponses(data?.data);
      setLoading(false);
    }
  }, [data]);

  // Export responses as CSV
  const exportToCSV = async () => {
    setExporting(true);
    try {
      // Get all responses data
      const allResponses = responses;

      if (allResponses.length === 0) {
        alert('No responses to export');
        return;
      }

      // Create CSV headers
      const headers = ['Submitted By', 'Submitted At', 'Response ID'];

      // Add field headers
      form.fields.forEach((field) => {
        headers.push(field.label || field.type);
      });

      // Create CSV rows
      const csvRows = [];

      // Add header row
      csvRows.push(headers.join(','));

      // Add data rows
      allResponses.forEach((response) => {
        const row = [
          `"${response.data.fullname}"`,
          `"${new Date(response.createdAt).toLocaleString()}"`,
          `"${response._id}"`,
        ];

        // Add field responses
        form.fields.forEach((field) => {
          const fieldValue = response.data[field.id] || '';
          let displayValue = fieldValue;

          // Handle different field types
          if (Array.isArray(fieldValue)) {
            displayValue = fieldValue.join('; ');
          } else if (typeof fieldValue === 'object' && fieldValue?.name) {
            // File upload
            displayValue = `File: ${fieldValue.name}`;
          }

          // Escape quotes and commas in the value
          displayValue = String(displayValue).replace(/"/g, '""');
          row.push(`"${displayValue}"`);
        });

        csvRows.push(row.join(','));
      });

      // Create and download CSV file
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `${form.title.replace(/[^a-z0-9]/gi, '_')}_responses.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export responses. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-medium mb-6"
      >
        <Icons.Back /> Back to Forms
      </button>

      <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
        {/* Banner */}
        <div className="px-6 py-4 bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-lg">{form.title}</h2>
              <p className="text-gray-300 text-sm">
                {form?.responseCount || 0} Response{form?.responseCount !== 1 ? 's' : ''}
              </p>
            </div>
            {form?.responseCount > 0 && (
              <button
                onClick={exportToCSV}
                disabled={exporting}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <Icons.Download />
                {exporting ? 'Exporting...' : 'Export responses'}
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-400">Loading responses...</div>
        ) : responses.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-lg mb-1">No responses yet</p>
            <p className="text-sm">Share your form to start collecting responses</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {responses.map((resp) => (
              <button
                key={resp.id}
                onClick={() => onViewResponse(resp)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
              >
                <div>
                  <p className="font-semibold text-gray-900 text-[14.5px]">{resp.data.fullname}</p>
                  <p className="text-[13px] text-gray-500 mt-[2px]">
                    {' '}
                    Date Submitted:{' '}
                    {new Date(resp.createdAt).toLocaleDateString('en-NG', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <span className="text-gray-400">
                  <Icons.Eye />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
