import { ArrowUpRight, BinFull, Edit, Plus, Xmark } from 'iconoir-react';
import { useEffect, useRef, useState } from 'react';
import { notify } from '../../../../../../utils/toast';
import { updateAdminData } from '../../../../api/admin/content';
import { uploadDocumentWithProgress } from '../../../../api/uploader/uploadFIles';
import Loader from '../../../../shared/loader/loader';
import '../../styles/pages.scss';
import pdff from './pdff.png';

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const Resources = ({ mda_data }) => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newResource, setNewResource] = useState({ name: '', url: '' });
  const [editFile, setEditFile] = useState(null);
  const [editIndex, setEditIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [updateInfo, setUpdateInfo] = useState('');

  // Batch upload queue: { id, file, name, status, progress, url, error }
  const [uploadQueue, setUploadQueue] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setData(mda_data);
  }, [mda_data]);

  // ── Add modal ──────────────────────────────────────────────────────────────
  const openModal = () => {
    setUploadQueue([]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setUploadQueue([]);
    setIsModalOpen(false);
    setUploading(false);
  };

  const handleFilesSelected = (e) => {
    const selected = Array.from(e.target.files);
    const valid = [];

    selected.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        notify.error(`"${file.name}" exceeds the 50 MB limit and was skipped.`);
        return;
      }
      valid.push({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        name: file.name.replace(/\.[^/.]+$/, ''), // strip extension for display name
        status: 'pending', // pending | uploading | done | error
        progress: 0,
        url: '',
        error: '',
      });
    });

    setUploadQueue((prev) => [...prev, ...valid]);
    e.target.value = '';
  };

  const removeFromQueue = (id) => {
    setUploadQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const renameInQueue = (id, name) => {
    setUploadQueue((prev) => prev.map((item) => (item.id === id ? { ...item, name } : item)));
  };

  const handleBatchUpload = async () => {
    const pending = uploadQueue.filter((q) => q.status === 'pending');
    if (!pending.length) return;

    setUploading(true);

    // Upload all in parallel
    await Promise.all(
      pending.map(async (item) => {
        setUploadQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: 'uploading' } : q))
        );

        try {
          const res = await uploadDocumentWithProgress(
            item.file,
            `${mda_data.fullname}/resources`,
            (percent) => {
              setUploadQueue((prev) =>
                prev.map((q) => (q.id === item.id ? { ...q, progress: percent } : q))
              );
            }
          );

          setUploadQueue((prev) =>
            prev.map((q) =>
              q.id === item.id ? { ...q, status: 'done', progress: 100, url: res.data.url } : q
            )
          );
        } catch (err) {
          setUploadQueue((prev) =>
            prev.map((q) =>
              q.id === item.id
                ? { ...q, status: 'error', error: err.message || 'Upload failed' }
                : q
            )
          );
        }
      })
    );

    setUploading(false);
  };

  // Save all done items to resources after uploads finish
  useEffect(() => {
    if (!uploadQueue.length) return;
    const allSettled = uploadQueue.every((q) => q.status === 'done' || q.status === 'error');
    if (!allSettled || uploading) return;

    const successful = uploadQueue.filter((q) => q.status === 'done');
    if (!successful.length) return;

    const newDocs = successful.map((q) => ({ name: q.name, url: q.url }));
    setData((prev) => ({
      ...prev,
      resources: [...(prev.resources || []), ...newDocs],
    }));
    setUpdateInfo(`batch uploaded ${successful.length} resource(s)`);
    closeModal();
  }, [uploadQueue, uploading]);

  // ── Edit modal ─────────────────────────────────────────────────────────────
  const openEditModal = (idx) => {
    setEditIndex(idx);
    setNewResource(data.resources[idx]);
    setEditFile(null);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setNewResource({ name: '', url: '' });
    setEditFile(null);
    setIsEditModalOpen(false);
  };

  const handleEditFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (selected.size > MAX_FILE_SIZE) {
      notify.error(`File exceeds the 50 MB limit.`);
      e.target.value = '';
      return;
    }
    setEditFile(selected);
    setNewResource((prev) => ({ ...prev, name: selected.name }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editFile) {
        const res = await uploadDocumentWithProgress(
          editFile,
          `${mda_data.fullname}/resources`,
          null
        );
        newResource.url = res.data.url;
      }
      data.resources[editIndex] = { ...newResource };
      setUpdateInfo(`updated resource - ${newResource.name}`);
      closeEditModal();
    } catch (error) {
      notify.error(error.message || 'Error updating resource. Please try again.');
      setIsLoading(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const deleteItem = async (idx) => {
    const resourceToDelete = data.resources[idx];
    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    try {
      setIsLoading(true);
      const updatedResources = data.resources.filter((_, i) => i !== idx);
      setData((prev) => ({ ...prev, resources: updatedResources }));
      setUpdateInfo(`deleted resource - ${resourceToDelete.name}`);
    } catch (error) {
      notify.error('Failed to delete resource. Please try again.');
      setIsLoading(false);
    }
  };

  // ── Backend save ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (updateInfo !== '') updateData();
  }, [updateInfo]);

  const updateData = async () => {
    try {
      setIsLoading(true);
      await updateAdminData(data._id, data, updateInfo);
      setUpdateInfo('');
    } catch (error) {
      notify.error('Failed to update resources. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const onChange = (e) => {
    setNewResource((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const filteredResources =
    data?.resources?.filter((resource) => {
      if (!searchTerm) return true;
      return resource.name?.toLowerCase().includes(searchTerm.toLowerCase());
    }) || [];

  const allDone =
    uploadQueue.length > 0 && uploadQueue.every((q) => q.status === 'done' || q.status === 'error');
  const hasPending = uploadQueue.some((q) => q.status === 'pending');

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="table__main__body">
        {/* ── Add modal (batch) ── */}
        {isModalOpen && (
          <div className="addModal">
            <div className="addModal__card" style={{ maxWidth: '560px', width: '100%' }}>
              <div className="topic">Add Documents</div>
              <div className="closeModal" onClick={closeModal}>
                <Xmark />
              </div>

              {/* Drop / select area */}
              {!uploading && (
                <div
                  style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '8px',
                    padding: '24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    marginBottom: '16px',
                    background: '#fafafa',
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Plus style={{ margin: '0 auto 8px', color: '#9ca3af' }} width={28} height={28} />
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                    Click to select PDFs &nbsp;·&nbsp; multiple files supported
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleFilesSelected}
                  />
                </div>
              )}

              {/* Queue list */}
              {uploadQueue.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    maxHeight: '320px',
                    overflowY: 'auto',
                    marginBottom: '16px',
                  }}
                >
                  {uploadQueue.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        background: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '12px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: item.status === 'pending' ? '6px' : '8px',
                        }}
                      >
                        <img src={pdff} alt="" style={{ width: '28px', flexShrink: 0 }} />

                        {/* Editable name */}
                        {item.status === 'pending' ? (
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => renameInQueue(item.id, e.target.value)}
                            style={{
                              flex: 1,
                              border: '1px solid #d1d5db',
                              borderRadius: '5px',
                              padding: '6px 8px',
                              fontSize: '13px',
                              outline: 'none',
                            }}
                          />
                        ) : (
                          <span
                            style={{
                              flex: 1,
                              fontSize: '13px',
                              fontWeight: 500,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.name}
                          </span>
                        )}

                        {/* Status badge / remove */}
                        {item.status === 'pending' && (
                          <button
                            onClick={() => removeFromQueue(item.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#9ca3af',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <Xmark width={16} height={16} />
                          </button>
                        )}
                        {item.status === 'done' && (
                          <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>
                            ✓ Done
                          </span>
                        )}
                        {item.status === 'error' && (
                          <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600 }}>
                            ✗ Failed
                          </span>
                        )}
                      </div>

                      {/* Progress bar */}
                      {(item.status === 'uploading' || item.status === 'done') && (
                        <div
                          style={{
                            height: '6px',
                            background: '#e5e7eb',
                            borderRadius: '99px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${item.progress}%`,
                              background: item.status === 'done' ? '#16a34a' : '#2563eb',
                              borderRadius: '99px',
                              transition: 'width 0.2s ease',
                            }}
                          />
                        </div>
                      )}
                      {item.status === 'uploading' && (
                        <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                          {item.progress}%
                        </p>
                      )}
                      {item.status === 'error' && (
                        <p style={{ fontSize: '11px', color: '#dc2626', marginTop: '4px' }}>
                          {item.error}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Footer actions */}
              <div style={{ display: 'flex', gap: '10px' }}>
                {!uploading && !allDone && hasPending && (
                  <>
                    <button
                      type="button"
                      className="button__primary2 text-center justify-center flex items-center gap-1"
                      style={{ flex: 1 }}
                      onClick={handleBatchUpload}
                      disabled={!hasPending}
                    >
                      Upload {uploadQueue.filter((q) => q.status === 'pending').length} file
                      {uploadQueue.filter((q) => q.status === 'pending').length !== 1 ? 's' : ''}
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        padding: '10px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        background: '#fff',
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      Add more
                    </button>
                  </>
                )}
                {uploading && (
                  <div
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      color: '#6b7280',
                      fontSize: '13px',
                      padding: '10px 0',
                    }}
                  >
                    Uploading…
                  </div>
                )}
                {!uploading && uploadQueue.length === 0 && (
                  <p
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      color: '#9ca3af',
                      fontSize: '13px',
                      padding: '4px 0',
                    }}
                  >
                    Select files above to begin
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Edit modal (single) ── */}
        {isEditModalOpen && (
          <div className="addModal">
            <div className="addModal__card">
              <div className="topic">Edit Resource</div>
              <div className="closeModal" onClick={closeEditModal}>
                <Xmark />
              </div>

              <form className="people__zone docForm" onSubmit={handleEditSubmit}>
                <div className="form__child">
                  <label>Replace File (optional)</label>
                  <input type="file" accept="application/pdf" onChange={handleEditFileChange} />
                </div>

                <div className="form__child">
                  <label>Document Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Document Name"
                    value={newResource.name}
                    onChange={onChange}
                  />
                </div>

                <div className="form__child submitAction">
                  <button
                    type="submit"
                    className="button__primary2 text-center justify-center flex items-center gap-1"
                  >
                    Update Resource
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isLoading && <Loader customClass="" />}

        {/* ── Page header ── */}
        <div className="titleAdmin flex items-center justify-between z-90">
          <h2 className="text-[15px] font-semibold text-gray-900">
            Resources -{' '}
            <span className="text-[14px] font-normal text-gray-500">
              Update the resources of the MDA
            </span>
          </h2>

          {/* add mda */}
          <button
            onClick={openModal}
            className="bg-green-800 text-[13px] cursor-pointer py-2 px-4 flex items-center gap-1 font-medium rounded-sm text-white"
          >
            <Plus /> Add Document
          </button>
        </div>

        {/* ── Resource list ── */}
        <div className="tableData">
          {filteredResources.length ? (
            filteredResources.map((res, idx) => (
              <div className="table__item flex" key={idx}>
                <div className="flex flex-col justify-between w-full min-w-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex-shrink-0">
                      <img src={pdff} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-gray-900 truncate" title={res.name}>
                        {res.name}
                      </div>
                      <div
                        className="text-sm text-gray-500 truncate"
                        title={res.date || 'PDF Document'}
                      >
                        {res.date || 'PDF Document'}
                      </div>
                    </div>
                  </div>
                  <div className="tr__item flex act--item mt-5 overflow-x-auto">
                    <div
                      className="action !bg-gray-800 !text-white"
                      onClick={() => window.open(res.url, '_blank')}
                    >
                      <div className="flex items-center justify-center">
                        <ArrowUpRight fontSize={9} strokeWidth={1.8} />
                      </div>
                      View
                    </div>
                    <div className="action" onClick={() => openEditModal(idx)}>
                      <div className="flex items-center justify-center">
                        <Edit fontSize={11} strokeWidth={1.8} />
                      </div>
                      Edit
                    </div>
                    <div className="action" onClick={() => deleteItem(idx)}>
                      <div className="flex items-center justify-center">
                        <BinFull fontSize={11} strokeWidth={1.8} />
                      </div>
                      Delete
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full text-[16px] text-gray-600">
              {searchTerm
                ? 'No matching resources found.'
                : 'No resources available. Click "Add Document" to upload a new resource.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resources;
