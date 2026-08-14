import { useQuery } from '@tanstack/react-query';
import { Edit, Plus, Trash, Xmark } from 'iconoir-react';
import { useState } from 'react';
import {
  addNews,
  deleteNews,
  getAllNewsByMda,
  updateNews,
} from '../../../../../../api/read/news.req';
import { notify } from '../../../../../../utils/toast';
import { uploadFileDirect } from '../../../../api/admin/content';
import { useThemeStore } from '../../../../stores/theme.store';
import Loader from '../../../../shared/loader/loader';
import SearchInput from '../../components/searchInput/SearchInput';
import LASGEditor from '../../components/text-editor/lasg_custom_editor';
import '../../styles/pages.scss';

const emptyForm = { title: '', date: '', categories: '', photo: '', content: '' };

const NewsAdmin = () => {
  const mdaData = useThemeStore((state) => state.mdaData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-news', mdaData?._id],
    queryFn: () => getAllNewsByMda(mdaData._id),
    enabled: !!mdaData?._id,
  });

  const articles = data?.data || [];

  const filteredArticles = articles.filter((article) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      article.title?.toLowerCase().includes(searchLower) ||
      (article.categories || []).some((c) => c.toLowerCase().includes(searchLower))
    );
  });

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (article) => {
    setEditingId(article._id);
    setForm({
      title: article.title || '',
      date: article.date ? String(article.date).slice(0, 10) : '',
      categories: (article.categories || []).join(', '),
      photo: article.photo || '',
      content: article.content || '',
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

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, photo: blobUrl }));

    setIsUploading(true);
    uploadFileDirect(file, `${mdaData.fullname.replace(/\s+/g, '-')}-news-${Date.now()}`)
      .then((response) => {
        if (response.status === 'ok') {
          setForm((prev) => ({ ...prev, photo: response.url }));
        } else {
          notify.error(response.message || 'Failed to upload image. Please try again.');
        }
      })
      .catch((err) => notify.error(err.message || 'Failed to upload image. Please try again.'))
      .finally(() => setIsUploading(false));
  };

  const handleSubmit = () => {
    if (!form.title || !form.date || !form.categories || !form.photo || !form.content) {
      notify.error('Please fill in all fields, including an image, before saving.');
      return;
    }

    setIsSaving(true);

    const payload = {
      title: form.title,
      date: form.date,
      categories: form.categories
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
      photo: form.photo,
      content: form.content,
      mda: '',
      targetMDA: [mdaData._id],
    };

    const request = editingId ? updateNews(editingId, payload) : addNews(payload);

    request
      .then(() => {
        notify.success(
          editingId ? 'News article updated successfully!' : 'News article published successfully!'
        );
        closeModal();
        refetch();
      })
      .catch((err) => notify.error(err.message || 'Failed to save news article. Please try again.'))
      .finally(() => setIsSaving(false));
  };

  const handleDelete = (article) => {
    const shouldDelete = confirm(`Delete "${article.title}"? This cannot be undone.`);
    if (!shouldDelete) return;

    deleteNews(article._id)
      .then(() => {
        notify.success('News article deleted successfully!');
        refetch();
      })
      .catch((err) => notify.error(err.message || 'Failed to delete article.'));
  };

  return (
    <div className="flex flex-col gap-6">
      {(isLoading || isSaving) && <Loader customClass="" />}

      <div className="titleAdmin flex items-center justify-between z-90">
        <h2 className="text-[15px] font-semibold text-gray-900">
          MDA's Newsroom -{' '}
          <span className="text-[14px] font-normal text-gray-500">
            Publish and manage news articles for your MDA
          </span>
        </h2>
        <div className="h-10 w-[450px]">
          <SearchInput
            placeholder="Search news articles..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
        <button
          onClick={openCreateModal}
          className="bg-green-800 text-[13px] cursor-pointer py-2 px-4 flex items-center gap-1 font-medium rounded-sm text-white"
        >
          <Plus /> Add News
        </button>
      </div>

      <div className="table__main__body mt-16! rounded-xl border border-gray-100 bg-white overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 text-[11px] uppercase tracking-[1.5px] text-gray-500">
              <th className="px-4 py-3 font-semibold w-[60px]">S/N</th>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Categories</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article, index) => (
                <tr
                  key={article._id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60"
                >
                  <td className="px-4 py-3 text-[14px] text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3 text-[14px] font-medium max-w-[320px]">
                    <span className="line-clamp-2">{article.title}</span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-gray-500">
                    {(article.categories || []).join(', ')}
                  </td>
                  <td className="px-4 py-3 text-[14px] text-gray-500">
                    {article.date ? String(article.date).slice(0, 10) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-4">
                      <button
                        type="button"
                        className="flex items-center gap-1 text-[13px] text-gray-600 hover:text-green-700"
                        onClick={() => openEditModal(article)}
                      >
                        <Edit fontSize={14} strokeWidth={1.8} /> Edit
                      </button>
                      <button
                        type="button"
                        className="flex items-center gap-1 text-[13px] text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(article)}
                      >
                        <Trash fontSize={14} strokeWidth={1.8} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[14px] text-gray-500">
                  {searchTerm ? 'No matching articles found.' : 'No news articles published yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
                {editingId ? 'Edit News Article' : 'Add News Article'}
              </h3>
              <button onClick={closeModal} className="cursor-pointer">
                <Xmark />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-gray-500">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter news title"
                value={form.title}
                onChange={handleChange}
                className="p-4 w-full text-[15px] border-none outline-none bg-gray-50 rounded-lg"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-[13px] font-medium text-gray-500">Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="p-4 w-full text-[15px] border-none outline-none bg-gray-50 rounded-lg"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-[13px] font-medium text-gray-500">
                  Categories (comma separated)
                </label>
                <input
                  type="text"
                  name="categories"
                  placeholder="e.g. Health, Community"
                  value={form.categories}
                  onChange={handleChange}
                  className="p-4 w-full text-[15px] border-none outline-none bg-gray-50 rounded-lg"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-gray-500">Photo</label>
              <input
                type="file"
                id="news_photo"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={isUploading}
                hidden
              />
              <button
                type="button"
                onClick={() => document.getElementById('news_photo').click()}
                disabled={isUploading}
                className="text-[13px] font-medium bg-gray-100 text-gray-700 px-4 py-3 rounded-lg cursor-pointer disabled:opacity-50 w-full text-left"
              >
                {isUploading ? 'Uploading...' : form.photo ? 'Change Photo' : 'Choose Photo'}
              </button>
              {form.photo && (
                <img
                  src={form.photo}
                  alt=""
                  className="h-[160px] w-full object-cover rounded-lg bg-gray-100"
                />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-gray-500">Content</label>
              <LASGEditor
                dataText={(html) => setForm((prev) => ({ ...prev, content: html }))}
                value={form.content}
                height="300px"
              />
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
                disabled={isSaving || isUploading}
                className="flex-1 py-3 rounded-[5px] bg-green-700 text-white text-[13px] font-bold cursor-pointer disabled:opacity-60"
              >
                {isSaving ? 'Saving...' : editingId ? 'Save Changes' : 'Publish Article'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsAdmin;
