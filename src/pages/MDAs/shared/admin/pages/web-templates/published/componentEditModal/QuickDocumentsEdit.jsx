import { Attachment } from 'iconoir-react';
import { useRef, useState } from 'react';
import { notify } from '../../../../../../../../utils/toast';
import { uploadDocument } from '../../../../../../api/admin/content';
import { useEditDataStore } from '../../../../../../stores/editData.store';
import { useThemeStore } from '../../../../../../stores/theme.store';
import SectionTitle from './util/SectionTitle';

const QuickDocumentsEdit = () => {
  const setMdaEditData = useEditDataStore((state) => state.setMdaEditData);
  const mdaEditData = useEditDataStore((state) => state.mdaEditData);
  const { fullname } = useThemeStore((s) => s.mdaData);
  const [uploadingIndices, setUploadingIndices] = useState(new Set());
  const [uploadProgress, setUploadProgress] = useState({});
  const documentRefs = useRef([]);
  const containerRef = useRef(null);

  const toggleSection = () => {
    setMdaEditData({
      ...mdaEditData,
      enabledSections: {
        ...mdaEditData.enabledSections,
        quickDocuments: !mdaEditData.enabledSections?.quickDocuments,
      },
    });
  };

  const handleChange = (e, field) => {
    const { name, value } = e.target;
    setMdaEditData({
      ...mdaEditData,
      quickDocuments: {
        ...mdaEditData.quickDocuments,
        [name]: value,
      },
    });
  };

  const handleDocumentChange = (e, index) => {
    const { name, value } = e.target;
    const updatedDocuments = [...(mdaEditData.quickDocuments?.documents || [])];
    updatedDocuments[index] = {
      ...updatedDocuments[index],
      [name]: value,
    };

    setMdaEditData({
      ...mdaEditData,
      quickDocuments: {
        ...mdaEditData.quickDocuments,
        documents: updatedDocuments,
      },
    });
  };

  const handleDocumentUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      notify.error('File size must be less than 25MB');
      return;
    }

    // Add to uploading set and start progress
    setUploadingIndices((prev) => new Set(prev).add(index));
    setUploadProgress((prev) => ({ ...prev, [index]: 0 }));

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        const currentProgress = prev[index] || 0;
        if (currentProgress < 90) {
          return { ...prev, [index]: Math.min(currentProgress + Math.random() * 15, 90) };
        }
        return prev;
      });
    }, 200);

    try {
      // Generate a unique filename
      const fileName = `${fullname.replace(' ', '-')}-quick-doc-${index}-${Date.now()}`;
      const documentUrl = await uploadDocument(file, fileName);

      // Clear interval and set to 100%
      clearInterval(progressInterval);
      setUploadProgress((prev) => ({ ...prev, [index]: 100 }));

      // Update the document with the uploaded URL
      const updatedDocuments = [...(mdaEditData.quickDocuments?.documents || [])];
      updatedDocuments[index] = {
        ...updatedDocuments[index],
        link: documentUrl,
      };

      setMdaEditData({
        ...mdaEditData,
        quickDocuments: {
          ...mdaEditData.quickDocuments,
          documents: updatedDocuments,
        },
      });

      notify.success('Document uploaded successfully');

      // Clean up after a short delay
      setTimeout(() => {
        setUploadingIndices((prev) => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[index];
          return newProgress;
        });
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      notify.error(err.message || 'Failed to upload document');
      setUploadingIndices((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[index];
        return newProgress;
      });
    }
  };

  const addDocument = () => {
    const newDocument = {
      title: '',
      link: '',
    };

    setMdaEditData({
      ...mdaEditData,
      quickDocuments: {
        ...mdaEditData.quickDocuments,
        documents: [...(mdaEditData.quickDocuments?.documents || []), newDocument],
      },
    });

    setTimeout(() => {
      const lastIndex = mdaEditData.quickDocuments?.documents?.length || 0;
      if (documentRefs.current[lastIndex]) {
        documentRefs.current[lastIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      } else if (containerRef.current) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 50);
  };

  const removeDocument = (index) => {
    const updatedDocuments = [...(mdaEditData.quickDocuments?.documents || [])];
    updatedDocuments.splice(index, 1);

    setMdaEditData({
      ...mdaEditData,
      quickDocuments: {
        ...mdaEditData.quickDocuments,
        documents: updatedDocuments,
      },
    });
  };

  return (
    <div className="fixed top-[145px] left-[280px] w-[350px] h-[calc(100vh-145px)] bg-white overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] z-90">
      <SectionTitle />

      {/* Enable/Disable Toggle */}
      <div className="py-[20px] px-[30px] border-b border-gray-200 mt-[60px] bg-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Enable Section</span>
          <button
            onClick={toggleSection}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              mdaEditData.enabledSections?.quickDocuments ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                mdaEditData.enabledSections?.quickDocuments ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="p-[30px]" ref={containerRef}>
        <div className="flex flex-col gap-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={mdaEditData.quickDocuments?.title || ''}
              onChange={handleChange}
              className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none"
              placeholder="Enter Title"
            />
          </div>

          {/* Subtitle Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <textarea
              name="subtitle"
              value={mdaEditData.quickDocuments?.subtitle || ''}
              onChange={handleChange}
              rows={3}
              className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none resize-none field-sizing-content min-h-[100px]"
              placeholder="Enter preferred section title"
            />
          </div>

          {/* Button Text Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
            <input
              type="text"
              name="discoverMoreText"
              value={mdaEditData.quickDocuments?.discoverMoreText || ''}
              onChange={handleChange}
              className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none"
              placeholder="Enter preffered button text"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 pt-4"></div>

          {/* Documents Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 w-full">
              <h3 className="font-semibold text-[15px]">Documents</h3>
              <button
                onClick={addDocument}
                className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Add Document
              </button>
            </div>

            <div className="space-y-4">
              {mdaEditData.quickDocuments?.documents?.map((document, index) => {
                // Create a ref for each document item if it doesn't exist
                if (!documentRefs.current[index]) {
                  documentRefs.current[index] = null;
                }

                return (
                  <div
                    key={index}
                    ref={(ref) => (documentRefs.current[index] = ref)}
                    className="flex gap-4 flex-col border-b border-gray-200 pb-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-[14px]">Document {index + 1}</h4>
                      <button
                        onClick={() => removeDocument(index)}
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="space-y-3">
                      {/* Document Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Document Name
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={document.title || ''}
                          onChange={(e) => handleDocumentChange(e, index)}
                          className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none"
                          placeholder="Document title"
                        />
                      </div>

                      {/* Document Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Document File
                        </label>
                        <div className="mt-1 flex items-center">
                          <span className="inline-block h-12 w-12 overflow-hidden bg-gray-100 rounded-md relative flex items-center justify-center">
                            {document.link ? (
                              <div className="h-full w-full bg-green-100 flex items-center justify-center">
                                <Attachment className="text-green-600" />
                              </div>
                            ) : (
                              <div className="h-full w-full bg-gray-200 flex items-center justify-center text-[12px]">
                                <Attachment className="text-gray-500" />
                              </div>
                            )}
                            {uploadingIndices.has(index) && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            )}
                          </span>
                          <label className="ml-3">
                            <div className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-xs text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
                              {document.link ? 'Change' : 'Upload'}
                            </div>
                            <input
                              type="file"
                              className="sr-only"
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                              onChange={(e) => handleDocumentUpload(e, index)}
                            />
                          </label>
                        </div>
                        {uploadingIndices.has(index) && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>Uploading...</span>
                              <span>{Math.round(uploadProgress[index] || 0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-green-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${uploadProgress[index] || 0}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        {document.link && (
                          <div className="mt-2">
                            <a
                              href={document.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-green-600 hover:text-green-800 underline"
                            >
                              View uploaded document
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickDocumentsEdit;
