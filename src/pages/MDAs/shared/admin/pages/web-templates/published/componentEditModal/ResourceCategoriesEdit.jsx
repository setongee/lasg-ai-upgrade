import { Attachment } from 'iconoir-react';
import { useRef, useState } from 'react';
import { notify } from '../../../../../../../../utils/toast';
import { uploadFileDirect } from '../../../../../../api/admin/content';
import { useEditDataStore } from '../../../../../../stores/editData.store';
import { useThemeStore } from '../../../../../../stores/theme.store';
import { truncateText } from '../../../../../../../../middleware/middleware';
import SectionTitle from './util/SectionTitle';

const ResourceCategoriesEdit = () => {
  const setMdaEditData = useEditDataStore((state) => state.setMdaEditData);
  const mdaEditData = useEditDataStore((state) => state.mdaEditData);
  const { fullname } = useThemeStore((s) => s.mdaData);
  const [uploadingIndices, setUploadingIndices] = useState(new Set());
  const [uploadProgress, setUploadProgress] = useState({});
  const cardRefs = useRef([]);
  const containerRef = useRef(null);

  const toggleSection = () => {
    setMdaEditData({
      ...mdaEditData,
      enabledSections: {
        ...mdaEditData.enabledSections,
        resourceCategories: !mdaEditData.enabledSections?.resourceCategories,
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMdaEditData({
      ...mdaEditData,
      resourceCategories: {
        ...mdaEditData.resourceCategories,
        [name]: value,
      },
    });
  };

  const handleCardChange = (e, index) => {
    const { name, value } = e.target;
    const updatedCards = [...(mdaEditData.resourceCategories?.cards || [])];
    updatedCards[index] = {
      ...updatedCards[index],
      [name]: value,
    };

    setMdaEditData({
      ...mdaEditData,
      resourceCategories: {
        ...mdaEditData.resourceCategories,
        cards: updatedCards,
      },
    });
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      notify.error('File size must be less than 2MB');
      return;
    }

    const blobUrl = URL.createObjectURL(file);
    // Immediately update the image with blob for instant preview
    const updatedCards = [...(mdaEditData.resourceCategories?.cards || [])];
    updatedCards[index] = {
      ...updatedCards[index],
      image: blobUrl,
    };

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

    setMdaEditData({
      ...mdaEditData,
      resourceCategories: {
        ...mdaEditData.resourceCategories,
        cards: updatedCards,
      },
    });

    // Upload directly to Cloudinary (bypasses our server entirely for the file bytes)
    uploadFileDirect(file, `${fullname.replace(' ', '-')}-resource-card-image-${index}`)
      .then((response) => {
        if (response.status === 'ok') {
          // Clear interval and set to 100%
          clearInterval(progressInterval);
          setUploadProgress((prev) => ({ ...prev, [index]: 100 }));

          // Get current state to avoid race conditions
          const currentData = useEditDataStore.getState().mdaEditData;
          setMdaEditData({
            ...currentData,
            resourceCategories: {
              ...currentData.resourceCategories,
              cards: currentData.resourceCategories.cards.map((card, idx) =>
                idx === index ? { ...card, image: response.url } : card
              ),
            },
          });

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
        } else {
          clearInterval(progressInterval);
          notify.error(response.message || 'Failed to upload image. Please try again.');
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
      })
      .catch((err) => {
        clearInterval(progressInterval);
        notify.error(err.message);
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
      });
  };

  const addCard = () => {
    const newCard = {
      title: '',
      description: '',
      buttonText: 'View Documents',
      image: '',
    };

    setMdaEditData({
      ...mdaEditData,
      resourceCategories: {
        ...mdaEditData.resourceCategories,
        cards: [...(mdaEditData.resourceCategories?.cards || []), newCard],
      },
    });

    setTimeout(() => {
      const lastIndex = mdaEditData.resourceCategories?.cards?.length || 0;
      if (cardRefs.current[lastIndex]) {
        cardRefs.current[lastIndex].scrollIntoView({
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

  const removeCard = (index) => {
    const updatedCards = [...(mdaEditData.resourceCategories?.cards || [])];
    updatedCards.splice(index, 1);

    setMdaEditData({
      ...mdaEditData,
      resourceCategories: {
        ...mdaEditData.resourceCategories,
        cards: updatedCards,
      },
    });
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
              mdaEditData.enabledSections?.resourceCategories ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                mdaEditData.enabledSections?.resourceCategories ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="p-[30px]" ref={containerRef}>
        <div className="flex flex-col gap-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
            <input
              type="text"
              name="title"
              value={mdaEditData.resourceCategories?.title || ''}
              onChange={handleChange}
              className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none"
              placeholder="Budget Resources & Documents"
            />
          </div>

          {/* Subtitle Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
            <textarea
              name="subtitle"
              value={mdaEditData.resourceCategories?.subtitle || ''}
              onChange={handleChange}
              rows={3}
              className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none resize-none field-sizing-content min-h-[100px]"
              placeholder="Access comprehensive budget documents, financial statements, and transparency reports"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 pt-4"></div>

          {/* Cards Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 w-full">
              <h3 className="font-semibold text-[15px]">Resource Cards</h3>
              <button
                onClick={addCard}
                className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Add Card
              </button>
            </div>

            <div className="space-y-4">
              {mdaEditData.resourceCategories?.cards?.map((card, index) => {
                // Create a ref for each card item if it doesn't exist
                if (!cardRefs.current[index]) {
                  cardRefs.current[index] = null;
                }

                return (
                  <div
                    key={index}
                    ref={(ref) => (cardRefs.current[index] = ref)}
                    className="flex gap-4 flex-col border-b border-gray-200 pb-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-[14px]">Card {index + 1}</h4>
                      <button
                        onClick={() => removeCard(index)}
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="space-y-3">
                      {/* Card Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Title</label>
                        <input
                          type="text"
                          name="title"
                          value={card.title || ''}
                          onChange={(e) => handleCardChange(e, index)}
                          className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none"
                          placeholder="Card title"
                        />
                      </div>

                      {/* Card Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Description</label>
                        <textarea
                          name="description"
                          value={card.description || ''}
                          onChange={(e) => handleCardChange(e, index)}
                          rows={3}
                          className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none resize-none"
                          placeholder="Card description"
                        />
                      </div>

                      {/* Button Text */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                        <input
                          type="text"
                          name="buttonText"
                          value={card.buttonText || ''}
                          onChange={(e) => handleCardChange(e, index)}
                          className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none"
                          placeholder="View Documents"
                        />
                      </div>

                      {/* Card Image */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Image</label>
                        <div className="mt-1 flex items-center">
                          <span className="inline-block h-12 w-12 overflow-hidden bg-gray-100 rounded-md relative">
                            {card.image ? (
                              <img
                                src={card.image}
                                alt="Card"
                                className="h-full w-full object-cover"
                              />
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
                              Change
                            </div>
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, index)}
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

export default ResourceCategoriesEdit;
