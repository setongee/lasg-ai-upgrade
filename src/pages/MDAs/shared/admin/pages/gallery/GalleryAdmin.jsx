import { useQuery } from '@tanstack/react-query';
import { Attachment, Edit, Plus, Trash, Xmark } from 'iconoir-react';
import { useState } from 'react';
import {
  addAlbum,
  deleteAlbum,
  getAlbumsForMda,
  updateAlbum,
} from '../../../../../../api/read/gallery.req';
import { notify } from '../../../../../../utils/toast';
import { uploadFileDirect } from '../../../../api/admin/content';
import { useThemeStore } from '../../../../stores/theme.store';
import Loader from '../../../../shared/loader/loader';
import SearchInput from '../../components/searchInput/SearchInput';
import '../../styles/pages.scss';

const emptyForm = { title: '', description: '', photos: [] };

const GalleryAdmin = () => {
  const mdaData = useThemeStore((state) => state.mdaData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [uploadingIndices, setUploadingIndices] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-gallery', mdaData?.name],
    queryFn: () => getAlbumsForMda(mdaData.name),
    enabled: !!mdaData?.name,
  });

  const albums = data?.data || [];

  const filteredAlbums = albums.filter((album) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      album.title?.toLowerCase().includes(searchLower) ||
      album.description?.toLowerCase().includes(searchLower)
    );
  });

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (album) => {
    setEditingId(album._id);
    setForm({
      title: album.title || '',
      description: album.description || '',
      photos: album.photos?.length ? album.photos : [],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addPhotoSlot = () => {
    setForm((prev) => ({ ...prev, photos: [...prev.photos, { url: '', caption: '' }] }));
  };

  const removePhotoSlot = (index) => {
    setForm((prev) => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
  };

  const updatePhotoCaption = (index, caption) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.map((p, i) => (i === index ? { ...p, caption } : p)),
    }));
  };

  const handlePhotoUpload = (index, file) => {
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.map((p, i) => (i === index ? { ...p, url: blobUrl } : p)),
    }));

    setUploadingIndices((prev) => ({ ...prev, [index]: true }));

    uploadFileDirect(
      file,
      `${mdaData.fullname.replace(/\s+/g, '-')}-gallery-${Date.now()}-${index}`
    )
      .then((response) => {
        if (response.status === 'ok') {
          setForm((prev) => ({
            ...prev,
            photos: prev.photos.map((p, i) => (i === index ? { ...p, url: response.url } : p)),
          }));
        } else {
          notify.error(response.message || 'Failed to upload image. Please try again.');
        }
      })
      .catch((err) => notify.error(err.message || 'Failed to upload image. Please try again.'))
      .finally(() => {
        setUploadingIndices((prev) => {
          const next = { ...prev };
          delete next[index];
          return next;
        });
      });
  };

  const handleSubmit = () => {
    const validPhotos = form.photos.filter((p) => p.url);

    if (!form.title || validPhotos.length === 0) {
      notify.error('Please add a title and at least one photo before saving.');
      return;
    }

    setIsSaving(true);

    const payload = {
      mda: mdaData.name,
      mdaFullname: mdaData.fullname,
      title: form.title,
      description: form.description,
      photos: validPhotos,
    };

    const request = editingId ? updateAlbum(editingId, payload) : addAlbum(payload);

    request
      .then(() => {
        notify.success(editingId ? 'Album updated successfully!' : 'Album created successfully!');
        closeModal();
        refetch();
      })
      .catch((err) => notify.error(err.message || 'Failed to save album. Please try again.'))
      .finally(() => setIsSaving(false));
  };

  const handleDelete = (album) => {
    const shouldDelete = confirm(`Delete "${album.title}"? This cannot be undone.`);
    if (!shouldDelete) return;

    deleteAlbum(album._id)
      .then(() => {
        notify.success('Album deleted successfully!');
        refetch();
      })
      .catch((err) => notify.error(err.message || 'Failed to delete album.'));
  };

  return (
    <div className="flex flex-col gap-6">
      {(isLoading || isSaving) && <Loader customClass="" />}

      <div className="titleAdmin flex items-center justify-between z-90">
        <h2 className="text-[15px] font-semibold text-gray-900">
          MDA's Gallery -{' '}
          <span className="text-[14px] font-normal text-gray-500">
            Manage photo albums for your MDA
          </span>
        </h2>
        <div className="h-10 w-[450px]">
          <SearchInput
            placeholder="Search albums..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
        <button
          onClick={openCreateModal}
          className="bg-green-800 text-[13px] cursor-pointer py-2 px-4 flex items-center gap-1 font-medium rounded-sm text-white"
        >
          <Plus /> Add Album
        </button>
      </div>

      <div className="table__main__body mt-16! grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAlbums.length > 0 ? (
          filteredAlbums.map((album) => (
            <div
              key={album._id}
              className="rounded-xl border border-gray-100 bg-white overflow-hidden"
            >
              <div className="h-[160px] w-full bg-gray-100">
                {album.coverImage ? (
                  <img src={album.coverImage} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400">
                    <Attachment />
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col gap-1">
                <p className="font-medium text-[14px] line-clamp-1">{album.title}</p>
                <p className="text-[12px] text-gray-500">{album.photos?.length || 0} photos</p>
                <div className="flex items-center gap-4 mt-3">
                  <button
                    type="button"
                    className="flex items-center gap-1 text-[13px] text-gray-600 hover:text-green-700"
                    onClick={() => openEditModal(album)}
                  >
                    <Edit fontSize={14} strokeWidth={1.8} /> Edit
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1 text-[13px] text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(album)}
                  >
                    <Trash fontSize={14} strokeWidth={1.8} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full rounded-xl border border-gray-100 bg-white px-4 py-8 text-center text-[14px] text-gray-500">
            {searchTerm ? 'No matching albums found.' : 'No albums created yet.'}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[999] flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg w-full max-w-[640px] max-h-[90vh] overflow-y-auto p-8 flex flex-col gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingId ? 'Edit Album' : 'Add Album'}
              </h3>
              <button onClick={closeModal} className="cursor-pointer">
                <Xmark />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-gray-500">Album Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. World Health Day Outreach"
                value={form.title}
                onChange={handleChange}
                className="p-4 w-full text-[15px] border-none outline-none bg-gray-50 rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-gray-500">
                Description (optional)
              </label>
              <textarea
                name="description"
                placeholder="Short description of this album"
                value={form.description}
                onChange={handleChange}
                className="p-4 w-full resize-none text-[15px] min-h-[80px] border-none outline-none bg-gray-50 rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[13px] font-medium text-gray-500">Photos</label>

              {form.photos.map((photo, i) => {
                const isUploadingPhoto = !!uploadingIndices[i];
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="relative w-[56px] h-[56px] rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                      {photo.url ? (
                        <img src={photo.url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Attachment className="text-gray-400" />
                      )}
                      {isUploadingPhoto && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Caption (optional)"
                      value={photo.caption}
                      onChange={(e) => updatePhotoCaption(i, e.target.value)}
                      className="flex-1 p-3 text-[13px] border-none outline-none bg-gray-50 rounded-lg"
                    />
                    <input
                      type="file"
                      id={`gallery_photo_${i}`}
                      accept="image/*"
                      hidden
                      onChange={(e) => handlePhotoUpload(i, e.target.files[0])}
                    />
                    <button
                      type="button"
                      disabled={isUploadingPhoto}
                      className="text-[13px] font-medium bg-gray-100 text-gray-700 px-3 py-2 rounded-[6px] cursor-pointer disabled:opacity-50 shrink-0"
                      onClick={() => document.getElementById(`gallery_photo_${i}`).click()}
                    >
                      {isUploadingPhoto ? '...' : photo.url ? 'Change' : 'Upload'}
                    </button>
                    <button
                      type="button"
                      disabled={isUploadingPhoto}
                      className="text-gray-400 hover:text-red-500 cursor-pointer shrink-0"
                      onClick={() => removePhotoSlot(i)}
                      aria-label="Remove photo"
                    >
                      <Trash width={16} />
                    </button>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={addPhotoSlot}
                className="text-[13px] font-medium text-green-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus width={16} /> Add Photo
              </button>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 py-3 rounded-[5px] border border-gray-200 bg-white text-gray-700 text-[13px] font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex-1 py-3 rounded-[5px] bg-green-700 text-white text-[13px] font-bold cursor-pointer disabled:opacity-60"
              >
                {isSaving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Album'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryAdmin;
