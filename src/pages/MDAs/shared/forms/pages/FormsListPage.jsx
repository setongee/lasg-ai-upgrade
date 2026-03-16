import { useState } from 'react';
import ConfirmModal from '../../confirmModal/confirm-modal';
import { Icons } from '../components/Icons';

export function FormsListPage({
  forms,
  onCreateNew,
  onEdit,
  onViewResponses,
  onDelete,
  onPreview,
  onCopyPublicUrl,
}) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);
  const [showActionsDropdown, setShowActionsDropdown] = useState(null);

  const handleDeleteClick = (form) => {
    setFormToDelete(form);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (formToDelete) {
      onDelete(formToDelete._id);
      setFormToDelete(null);
      setDeleteModalOpen(false);
    }
  };

  const handleActionsToggle = (formId) => {
    setShowActionsDropdown(showActionsDropdown === formId ? null : formId);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setFormToDelete(null);
  };
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Forms</h1>
          <p className="text-sm text-gray-500 mt-2">
            {forms.length} form{forms.length !== 1 ? 's' : ''} created
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <Icons.Plus /> New Form
        </button>
      </div>

      {/* Empty state */}
      {forms.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 text-lg mb-2">No forms yet</p>
          <p className="text-gray-400 text-sm mb-4">Create your first form to get started</p>
          <button
            onClick={onCreateNew}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
          >
            Create Form
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {forms.map((form) => (
            <div
              key={form.id}
              className="bg-white rounded-xl border-1 border-gray-200 p-5 hover:border-gray-300 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{form.title}</h3>
                  {form.description && (
                    <p className="text-sm text-gray-500 mt-0.5 w-[max-content]">
                      {form.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-gray-400 w-[max-content]">
                      Created{' '}
                      {new Date(form.createdAt).toLocaleDateString('en-NG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="text-xs text-gray-400 w-[max-content]">
                      {form.fields?.length || 0} fields
                    </span>
                    <span className="text-xs font-medium text-green-600 w-[max-content]">
                      {form.responseCount || 0} responses
                    </span>
                  </div>
                </div>

                {/* Actions (responsive) */}
                <div className="relative">
                  {/* Desktop Actions - visible on larger screens */}
                  <div className="hidden lg:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onPreview(form)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-full hover:bg-purple-100 transition-colors"
                      title="Preview"
                    >
                      <Icons.Eye />
                      Preview
                    </button>
                    <button
                      onClick={() => onCopyPublicUrl(form)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-full hover:bg-indigo-100 transition-colors"
                      title="Copy Public URL"
                    >
                      <Icons.Copy />
                      Copy Public URL
                    </button>
                    <button
                      onClick={() => onViewResponses(form)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded-full hover:bg-green-100 transition-colors"
                      title="View Responses"
                    >
                      <Icons.List />
                      Responses
                    </button>
                    <button
                      onClick={() => onEdit(form)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      <Icons.Edit />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(form)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-full hover:bg-red-100 transition-colors"
                    >
                      <Icons.Trash />
                      Delete
                    </button>
                  </div>

                  {/* Mobile Actions - visible on smaller screens */}
                  <div className="lg:hidden">
                    <button
                      onClick={() => handleActionsToggle(form._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Icons.MoreHoriz />
                      Actions
                    </button>

                    {/* Mobile Dropdown */}
                    {showActionsDropdown === form._id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => {
                            onPreview(form);
                            handleActionsToggle(form._id);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 flex items-center gap-2"
                        >
                          <Icons.Eye className="text-purple-600" />
                          Preview
                        </button>
                        <button
                          onClick={() => {
                            onCopyPublicUrl(form);
                            handleActionsToggle(form._id);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 flex items-center gap-2"
                        >
                          <Icons.Copy className="text-indigo-600" />
                          Copy Public URL
                        </button>
                        <button
                          onClick={() => {
                            onViewResponses(form);
                            handleActionsToggle(form._id);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 flex items-center gap-2"
                        >
                          <Icons.List className="text-green-600" />
                          Responses
                        </button>
                        <button
                          onClick={() => {
                            onEdit(form);
                            handleActionsToggle(form._id);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 flex items-center gap-2"
                        >
                          <Icons.Edit className="text-blue-600" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteClick(form);
                            handleActionsToggle(form._id);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Icons.Trash />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      >
        <div className="">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete the form "<strong>{formToDelete?.title}</strong>"?
          </p>
          <p className="text-sm text-gray-500">
            This action cannot be undone and all form responses will be permanently deleted.
          </p>
        </div>
      </ConfirmModal>
    </div>
  );
}
