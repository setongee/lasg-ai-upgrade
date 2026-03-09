import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { NavArrowDown } from 'iconoir-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { notify } from '../../../../../../../utils/toast';
import { deleteDraft, getDraftsByMda, updateDraft } from '../../../../../api/admin/drafts';
import { useEditDataStore } from '../../../../../stores/editData.store';
import { useThemeStore } from '../../../../../stores/theme.store';
import Loader from '../../../../loader/loader';
import Modal from '../../../../modal/Modal';
import SearchInput from '../../../components/searchInput/SearchInput';
import TemplateContainer from '../templates-container/TemplateContainer';

const Drafts = () => {
  const {
    setActiveDraftId,
    setMdaEditData,
    setOriginalData,
    getDraftList,
    currentDraftId,
    mdaEditData,
    renameDraft,
    createNewDraft,
    activeDraftId,
  } = useEditDataStore();

  const mdaId = useThemeStore((state) => state.mdaData?.slug);

  const [searchTerm, setSearchTerm] = useState('');
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [editingDraft, setEditingDraft] = useState(null);
  const [newDraftName, setNewDraftName] = useState('');
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const [draftList, setDraftList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Find the parent with class 'more-actions-container'
      const container = event.target.closest('.more-actions-container');
      if (container) {
        return;
      }
      setActiveDropdownId(null);
    };
    // Use capture phase to ensure this runs before other click handlers
    window.addEventListener('click', handleClickOutside, true);
    return () => window.removeEventListener('click', handleClickOutside, true);
  }, []);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['drafts', mdaId, isRenameModalOpen],
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

  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    if (!editingDraft || !newDraftName.trim()) return;

    const selectedDraft = data?.find((d) => d._id === editingDraft.id);

    await updateDraft(editingDraft.id, { ...selectedDraft.data, title: newDraftName }).then(
      (response) => {
        if (response.status === 'ok') {
          notify.success('Draft renamed successfully');
          setIsRenameModalOpen(false);
        }
      }
    );
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'PPpp');
    } catch (e) {
      return dateString;
    }
  };

  const handleLoadDraft = (id) => {
    // Find the specific draft from the query data to get its current content
    const selectedDraft = data?.find((d) => d._id === id);

    if (selectedDraft) {
      setActiveDraftId(id);
      setMdaEditData(selectedDraft.data);
      setOriginalData(selectedDraft.data);

      const toastId = notify.loading('Loading draft...');

      setTimeout(() => {
        notify.dismiss(toastId);
        navigate(`/${mdaId}/admin/published`);
      }, 2000);
    } else {
      notify.error('Failed to load draft data');
    }
  };

  const handlePreview = (id) => {
    window.open(`/${mdaId}/draft/${id}`, '_blank');
    setActiveDropdownId(null);
  };

  const handleDeleteDraft = async (id) => {
    const response = await deleteDraft(id, mdaId);
    if (response) {
      refetch();
    }
  };

  const startDraft = () => {
    const toastId = notify.loading('Creating draft...');

    setTimeout(() => {
      createNewDraft();
      notify.dismiss(toastId);
      window.location.href = `/${mdaId}/admin/published`;
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

      <div className="pb-20">
        <div className="bg-white shadow sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {data?.map(({ _id: id, updatedAt, title }, index) => (
              <li key={id}>
                <div
                  className={`px-4 py-4 sm:px-6 ${id === activeDraftId ? 'bg-[#d8e9e370]' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-500 truncate">
                        <span
                          className={`font-semibold text-gray-800 ${id === activeDraftId ? 'text-green-600' : ''}`}
                        >
                          {title}
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Last saved: {formatDate(updatedAt)}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex space-x-2 relative more-actions-container">
                      <button
                        onClick={() => handleLoadDraft(id)}
                        className={`px-3 py-1.5 border text-xs font-medium rounded-md ${
                          id === activeDraftId
                            ? 'bg-gray-100 text-gray-700 border-gray-300'
                            : 'bg-green-600 text-white border-transparent hover:bg-green-700'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                      >
                        {id === activeDraftId ? 'Currently Viewing...' : 'Load Draft'}
                      </button>

                      <div className="relative">
                        <button
                          onClick={() => {
                            setActiveDropdownId(activeDropdownId === id ? null : id);
                          }}
                          className="px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none flex items-center gap-1"
                        >
                          More actions <NavArrowDown width={14} height={14} />
                        </button>

                        {activeDropdownId === id && (
                          <div
                            className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-[100] border border-gray-100 py-1 ${
                              index >= data?.length - 2 && data?.length > 3
                                ? 'bottom-full mb-2'
                                : 'top-full'
                            }`}
                          >
                            <button
                              onClick={() => {
                                handlePreview(id);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors cursor-pointer"
                            >
                              Preview URL
                            </button>
                            <button
                              onClick={() => {
                                handleRenameClick({ id, title });
                                setActiveDropdownId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors cursor-pointer"
                            >
                              Rename
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this draft?')) {
                                  handleDeleteDraft(id);
                                  setActiveDropdownId(null);
                                }
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
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
