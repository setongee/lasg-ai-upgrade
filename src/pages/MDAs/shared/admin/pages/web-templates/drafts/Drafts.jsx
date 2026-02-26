import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { notify } from '../../../../../../../utils/toast';
import { getDraftsByMda } from '../../../../../api/admin/drafts';
import { useEditDataStore } from '../../../../../stores/editData.store';
import { useThemeStore } from '../../../../../stores/theme.store';
import Loader from '../../../../loader/loader';
import Modal from '../../../../modal/Modal';
import SearchInput from '../../../components/searchInput/SearchInput';
import TemplateContainer from '../templates-container/TemplateContainer';

const Drafts = () => {
  const {
    loadDraft,
    getDraftList,
    currentDraftId,
    deleteDraft,
    mdaEditData,
    renameDraft,
    createNewDraft,
  } = useEditDataStore();

  const mdaId = useThemeStore((state) => state.mdaData?.slug);

  const mdaId2 = useThemeStore((state) => state.mdaData);
  console.log(mdaId2);
  console.log(mdaEditData);

  const [searchTerm, setSearchTerm] = useState('');
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [editingDraft, setEditingDraft] = useState(null);
  const [newDraftName, setNewDraftName] = useState('');
  const inputRef = useRef(null);
  const [draftList, setDraftList] = useState([]);

  const { data, isLoading } = useQuery({
    queryKey: ['drafts', mdaId],
    queryFn: () => getDraftsByMda(mdaId),
  });

  useEffect(() => {
    if (isRenameModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isRenameModalOpen]);

  const handleRenameClick = (draft) => {
    setEditingDraft(draft);
    setNewDraftName(draft?.title || 'Untitled Draft');
    setIsRenameModalOpen(true);
  };

  const handleRenameSubmit = (e) => {
    e.preventDefault();
    if (!editingDraft || !newDraftName.trim()) return;

    renameDraft(editingDraft.id, newDraftName.trim());
    notify.success('Draft renamed successfully');
    setIsRenameModalOpen(false);
  };

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

  const startDraft = () => {
    notify.loading('Creating draft...');

    setTimeout(() => {
      createNewDraft();
      // window.location.href = `/${mdaId}/admin/published`;
    }, 2000);
  };

  if (isLoading) return <Loader />;

  if (data?.length === 0) {
    return (
      <div className="p-6 text-center flex flex-col items-center justify-center h-[calc(100vh-345px)]">
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
        <p className="text-[16px] text-gray-500">
          Start editing content to create your first draft.
        </p>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-[6px] mt-5 cursor-pointer"
          onClick={startDraft}
        >
          Create Draft
        </button>
      </div>
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
            {data?.map(({ _id: id, updatedAt, title }) => (
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
                      <p className="mt-1 text-sm text-gray-500">
                        Last saved: {formatDate(updatedAt)}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex space-x-2">
                      <button
                        onClick={() => handleLoadDraft(id)}
                        className={`px-3 py-1.5 border text-xs font-medium rounded-md ${
                          id === currentDraftId
                            ? 'bg-gray-100 text-gray-700 border-gray-300'
                            : 'bg-green-600 text-white border-transparent hover:bg-green-700'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                      >
                        {id === currentDraftId ? 'Currently Viewing...' : 'Load Draft'}
                      </button>
                      {/* rename draft */}
                      <button
                        onClick={() =>
                          handleRenameClick({
                            id,
                            title,
                          })
                        }
                        className="px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this draft?')) {
                            deleteDraft(id);
                          }
                        }}
                        className="px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Modal open={isRenameModalOpen} onClose={() => setIsRenameModalOpen(false)}>
        <div className="bg-white rounded-lg w-full flex flex-col items-center">
          <h2 className="text-[18px] font-semibold text-gray-900 mb-2">Rename Draft</h2>
          <p className="!text-[16px] text-center w-[60%] text-gray-500 mb-10">
            You can change your modify the draft name so its easy to know what it was for.
          </p>
          <form onSubmit={handleRenameSubmit} className="w-[70%]">
            <div className="mb-4">
              <label htmlFor="draftName" className="block text-sm font-semibold text-gray-700 mb-1">
                Draft Name
              </label>
              <input
                type="text"
                id="draftName"
                ref={inputRef}
                value={newDraftName}
                onChange={(e) => setNewDraftName(e.target.value)}
                className="focus:border-gray-200 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none"
                placeholder="Enter draft name"
              />
            </div>
            <div className="flex justify-start space-x-3">
              <button
                type="button"
                onClick={() => setIsRenameModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </TemplateContainer>
  );
};

export default Drafts;
