import { format } from 'date-fns';
import { useState } from 'react';
import { notify } from '../../../../../../../utils/toast';
import { useEditDataStore } from '../../../../../stores/editData.store';
import { useThemeStore } from '../../../../../stores/theme.store';
import SearchInput from '../../../components/searchInput/SearchInput';
import TemplateContainer from '../templates-container/TemplateContainer';

const Drafts = () => {
  const { loadDraft, getDraftList, currentDraftId, deleteDraft, mdaEditData } = useEditDataStore();
  const draftList = getDraftList();
  const mdaId = useThemeStore((state) => state.mda);

  const [searchTerm, setSearchTerm] = useState('');

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'PPpp');
    } catch (e) {
      return dateString;
    }
  };

  const handleLoadDraft = (id) => {
    loadDraft(id);
    notify.loading('Loading draft...');

    setTimeout(() => {
      window.location.href = `/${mdaId}/admin/published`;
    }, 2000);
  };

  const handleDeleteDraft = (id) => {
    deleteDraft(id);
    notify.success('Draft deleted successfully');
  };

  if (draftList.length === 0) {
    return (
      <TemplateContainer>
        <div className="titleAdmin flex items-center justify-between">
          <div className="searchField h-[100%] w-[450px]">
            <SearchInput
              placeholder="Search drafts..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
          <div className="p-6 text-center">
            <div className="text-gray-500 mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No drafts available</h3>
            <p className="text-sm text-gray-500">
              Start editing content to create your first draft.
            </p>
          </div>
        </div>
      </TemplateContainer>
    );
  }

  return (
    <TemplateContainer>
      <div className="titleAdmin flex items-center justify-between">
        <div className="searchField h-[100%] w-[450px]">
          <SearchInput placeholder="Search drafts..." value={searchTerm} onChange={setSearchTerm} />
        </div>
      </div>

      <div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {draftList.map(({ id, date, title }) => (
              <li key={id}>
                <div
                  className={`px-4 py-4 sm:px-6 ${id === currentDraftId ? 'bg-[#d8e9e370]' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-500 truncate">
                        <span
                          className={`font-semibold text-gray-800 ${id === currentDraftId ? 'text-green-600' : ''}`}
                        >
                          {title}
                        </span>{' '}
                        - {id}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">Last saved: {formatDate(date)}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex space-x-2">
                      <button
                        onClick={() => handleLoadDraft(id)}
                        className={`px-3 py-1.5 border text-xs font-medium rounded-md ${
                          id === currentDraftId
                            ? 'bg-gray-100 text-gray-700 border-gray-300'
                            : 'bg-green-600 text-white border-transparent hover:bg-indigo-700'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      >
                        {id === currentDraftId ? 'Currently Viewing' : 'Load Draft'}
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this draft?')) {
                            deleteDraft(id);
                          }
                        }}
                        className="px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Delete
                      </button>
                      {/* rename draft */}
                      <button>Rename</button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </TemplateContainer>
  );
};

export default Drafts;
