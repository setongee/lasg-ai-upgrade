import { Attachment, MediaImage, Plus, Trash } from 'iconoir-react';
import { useState } from 'react';
import { notify } from '../../../../../../../../utils/toast';
import { uploadDocument, uploadFileDirect } from '../../../../../../api/admin/content';
import { useEditDataStore } from '../../../../../../stores/editData.store';
import { useThemeStore } from '../../../../../../stores/theme.store';
import BackgroundColorPicker from '../../../../../colorPicker/BackgroundColorPicker';
import SectionTitle from './util/SectionTitle';

const DocumentShowcaseEdit = () => {
  const { mdaEditData, setMdaEditData } = useEditDataStore();
  const { fullname } = useThemeStore((state) => state.mdaData);
  const [uploadingThumbnails, setUploadingThumbnails] = useState({});
  const [uploadingFiles, setUploadingFiles] = useState({});

  const documents = mdaEditData?.documentShowcase?.documents || [];

  const toggleSection = () => {
    setMdaEditData({
      ...mdaEditData,
      enabledSections: {
        ...mdaEditData.enabledSections,
        documentShowcase: !mdaEditData.enabledSections?.documentShowcase,
      },
    });
  };

  const backgroundColor = mdaEditData.documentShowcase?.backgroundColor;

  const handleColorChange = (color) => {
    setMdaEditData({
      ...mdaEditData,
      documentShowcase: { ...mdaEditData.documentShowcase, backgroundColor: color },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMdaEditData({
      ...mdaEditData,
      documentShowcase: { ...mdaEditData.documentShowcase, [name]: value },
    });
  };

  const updateDocuments = (next) => {
    setMdaEditData({
      ...mdaEditData,
      documentShowcase: { ...mdaEditData.documentShowcase, documents: next },
    });
  };

  const addDocument = () => {
    updateDocuments([...documents, { name: '', thumbnail: '', url: '' }]);
  };

  const removeDocument = (index) => {
    updateDocuments(documents.filter((_, i) => i !== index));
  };

  const handleNameChange = (index, value) => {
    const next = [...documents];
    next[index] = { ...next[index], name: value };
    updateDocuments(next);
  };

  const handleThumbnailUpload = (index, file) => {
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      notify.error('File size must be less than 50MB');
      return;
    }

    const blobUrl = URL.createObjectURL(file);
    const withPreview = [...(mdaEditData.documentShowcase?.documents || [])];
    withPreview[index] = { ...withPreview[index], thumbnail: blobUrl };
    updateDocuments(withPreview);

    setUploadingThumbnails((prev) => ({ ...prev, [index]: true }));

    uploadFileDirect(file, `${fullname.replace(' ', '-')}-document-thumb-${index}`)
      .then((response) => {
        if (response.status === 'ok') {
          const withUploaded = [...(mdaEditData.documentShowcase?.documents || [])];
          withUploaded[index] = { ...withUploaded[index], thumbnail: response.url };
          updateDocuments(withUploaded);
        } else {
          notify.error(response.message || 'Failed to upload thumbnail. Please try again.');
        }
      })
      .catch((err) => notify.error(err?.message || 'Failed to upload thumbnail. Please try again.'))
      .finally(() => {
        setUploadingThumbnails((prev) => {
          const next = { ...prev };
          delete next[index];
          return next;
        });
      });
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      notify.error('File size must be less than 50MB');
      return;
    }

    setUploadingFiles((prev) => ({ ...prev, [index]: true }));

    try {
      const fileName = `${fullname.replace(' ', '-')}-document-${index}-${Date.now()}`;
      const documentUrl = await uploadDocument(file, fileName);
      const next = [...(mdaEditData.documentShowcase?.documents || [])];
      next[index] = { ...next[index], url: documentUrl };
      updateDocuments(next);
      notify.success('Document uploaded successfully');
    } catch (err) {
      notify.error(err?.message || 'Failed to upload document');
    } finally {
      setUploadingFiles((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    }
  };

  return (
    <div className="fixed top-[145px] left-0 w-[350px] h-[calc(100vh-145px)] bg-white overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] z-90">
      <SectionTitle />

      {/* Enable/Disable Toggle */}
      <div className="py-[20px] px-[30px] border-b border-gray-200 mt-[60px] bg-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Enable Section</span>
          <button
            onClick={toggleSection}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              mdaEditData.enabledSections?.documentShowcase ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                mdaEditData.enabledSections?.documentShowcase ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <BackgroundColorPicker value={backgroundColor} onChange={handleColorChange} />

      <div className="p-[30px] flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={mdaEditData.documentShowcase?.title || ''}
            onChange={handleChange}
            className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none"
            placeholder="e.g., Financial Statements"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
          <textarea
            name="subtitle"
            value={mdaEditData.documentShowcase?.subtitle || ''}
            onChange={handleChange}
            rows={2}
            className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none resize-none field-sizing-content"
            placeholder="Short description shown above the documents"
          />
        </div>

        <div className="border-t border-gray-200 pt-4" />

        <div className="flex justify-between items-center pb-2 w-full">
          <h3 className="font-semibold text-[15px]">Documents</h3>
          <button
            onClick={addDocument}
            className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 flex items-center gap-1"
          >
            <Plus width={14} /> Add
          </button>
        </div>

        <div className="space-y-5">
          {documents.map((doc, index) => {
            const isUploadingThumb = !!uploadingThumbnails[index];
            const isUploadingFile = !!uploadingFiles[index];
            return (
              <div key={index} className="flex gap-4 flex-col border-b border-gray-200 pb-5">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-[14px]">Document {index + 1}</h4>
                  <button
                    onClick={() => removeDocument(index)}
                    className="text-red-500 text-sm hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash width={14} /> Remove
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={doc.name || ''}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none"
                    placeholder="e.g., 2024 Annual Statement"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thumbnail Image
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative w-[56px] h-[56px] rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                      {doc.thumbnail ? (
                        <img src={doc.thumbnail} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <MediaImage className="text-gray-400" width={18} />
                      )}
                      {isUploadingThumb && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      id={`doc_thumb_${index}`}
                      accept="image/*"
                      hidden
                      onChange={(e) => handleThumbnailUpload(index, e.target.files[0])}
                    />
                    <button
                      type="button"
                      disabled={isUploadingThumb}
                      className="text-[13px] font-medium bg-gray-100 text-gray-700 px-3 py-2 rounded-[6px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => document.getElementById(`doc_thumb_${index}`).click()}
                    >
                      {isUploadingThumb ? 'Uploading...' : doc.thumbnail ? 'Change' : 'Upload'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File (PDF)</label>
                  <div className="flex items-center gap-3">
                    <div className="relative w-[56px] h-[56px] rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                      <Attachment className={doc.url ? 'text-green-600' : 'text-gray-400'} width={18} />
                      {isUploadingFile && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      id={`doc_file_${index}`}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                      hidden
                      onChange={(e) => handleFileUpload(index, e.target.files[0])}
                    />
                    <button
                      type="button"
                      disabled={isUploadingFile}
                      className="text-[13px] font-medium bg-gray-100 text-gray-700 px-3 py-2 rounded-[6px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => document.getElementById(`doc_file_${index}`).click()}
                    >
                      {isUploadingFile ? 'Uploading...' : doc.url ? 'Change' : 'Upload'}
                    </button>
                  </div>
                  {doc.url && (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-green-600 hover:text-green-800 underline mt-2 inline-block"
                    >
                      View uploaded file
                    </a>
                  )}
                </div>
              </div>
            );
          })}

          {documents.length === 0 && (
            <div className="text-gray-500 text-sm text-center py-4">
              No documents added yet. Click "Add" to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentShowcaseEdit;
