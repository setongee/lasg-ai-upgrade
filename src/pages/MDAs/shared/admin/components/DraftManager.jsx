import { format } from 'date-fns';
import { useEditDataStore } from '../../stores/editData.store';

export const DraftManager = () => {
  const { drafts, loadDraft, getDraftList, currentDraftDate } = useEditDataStore();
  const draftList = getDraftList();

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  if (draftList.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-500">
        No drafts available. Start editing to create a new draft.
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2">
      <h3 className="font-medium text-gray-700 mb-2">Saved Drafts</h3>
      <div className="space-y-1 max-h-60 overflow-y-auto">
        {draftList.map(({ date }) => (
          <button
            key={date}
            onClick={() => loadDraft(date)}
            className={`w-full text-left px-3 py-2 rounded text-sm ${
              date === currentDraftDate
                ? 'bg-blue-100 text-blue-700'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <div className="font-medium">{formatDate(date)}</div>
            <div className="text-xs text-gray-500">
              {date === currentDraftDate ? 'Currently viewing' : 'Click to load'}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DraftManager;
