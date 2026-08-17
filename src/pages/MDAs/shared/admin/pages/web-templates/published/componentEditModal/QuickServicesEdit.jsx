import { Attachment, Link, Mail, NavArrowDown, Phone } from 'iconoir-react';
import { useRef, useState } from 'react';
import { notify } from '../../../../../../../../utils/toast';
import { uploadFileDirect } from '../../../../../../api/admin/content';
import { useEditDataStore } from '../../../../../../stores/editData.store';
import { useThemeStore } from '../../../../../../stores/theme.store';
import BackgroundColorPicker from '../../../../../colorPicker/BackgroundColorPicker';
import SectionTitle from './util/SectionTitle';

const QuickServicesEdit = () => {
  const setMdaEditData = useEditDataStore((state) => state.setMdaEditData);
  const mdaEditData = useEditDataStore((state) => state.mdaEditData);
  const { fullname } = useThemeStore((s) => s.mdaData);
  const [showLinkTypeDropdown, setShowLinkTypeDropdown] = useState(-1);
  const [uploadingIndices, setUploadingIndices] = useState(new Set());
  const [uploadProgress, setUploadProgress] = useState({});
  const serviceRefs = useRef([]);
  const containerRef = useRef(null);

  const toggleSection = () => {
    setMdaEditData({
      ...mdaEditData,
      enabledSections: {
        ...mdaEditData.enabledSections,
        quickServices: !mdaEditData.enabledSections?.quickServices,
      },
    });
  };

  const backgroundColor = mdaEditData.quickServices?.backgroundColor;
  const style = mdaEditData.quickServices?.style || 'default';
  const ctaTitle = mdaEditData.quickServices?.ctaTitle;

  const handleColorChange = (color) => {
    setMdaEditData({
      ...mdaEditData,
      quickServices: {
        ...mdaEditData.quickServices,
        backgroundColor: color,
      },
    });
  };

  const setStyle = (value) => {
    setMdaEditData({
      ...mdaEditData,
      quickServices: {
        ...mdaEditData.quickServices,
        style: value,
      },
    });
  };

  const setCtaTitle = (value) => {
    setMdaEditData({
      ...mdaEditData,
      quickServices: {
        ...mdaEditData.quickServices,
        ctaTitle: value,
      },
    });
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedQuickServices = [...mdaEditData.servicesData];

    // If link type is changed, reset the link value
    if (name === 'linkType') {
      updatedQuickServices[index] = {
        ...updatedQuickServices[index],
        linkType: value,
        link: '',
      };
    } else {
      updatedQuickServices[index] = {
        ...updatedQuickServices[index],
        [name]: value,
      };
    }

    setMdaEditData({
      ...mdaEditData,
      servicesData: updatedQuickServices,
    });
  };

  const getFormattedLink = (service) => {
    if (!service.link) return '';

    switch (service.linkType) {
      case 'phone':
        return `tel:${service.link.replace(/[^0-9+]/g, '')}`;
      case 'email':
        return `mailto:${service.link}`;
      default:
        return service.link;
    }
  };

  const getLinkPlaceholder = (linkType) => {
    switch (linkType) {
      case 'phone':
        return 'e.g., +1234567890';
      case 'email':
        return 'e.g., example@domain.com';
      default:
        return 'e.g., https://example.com';
    }
  };

  const getLinkInputType = (linkType) => {
    switch (linkType) {
      case 'email':
        return 'email';
      case 'phone':
        return 'tel';
      default:
        return 'text';
    }
  };

  const validateLink = (value, linkType) => {
    if (!value) return true; // Empty is valid (optional field)

    switch (linkType) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'phone':
        return /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(value);
      default:
        return true;
    }
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
    const updatedQuickServices = [...mdaEditData.servicesData];
    updatedQuickServices[index] = {
      ...updatedQuickServices[index],
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
      servicesData: updatedQuickServices,
    });

    // Upload directly to Cloudinary (bypasses our server entirely for the file bytes)
    uploadFileDirect(file, `${fullname.replace(' ', '-')}-quick-services-image-${index}`)
      .then((response) => {
        if (response.status === 'ok') {
          // Clear interval and set to 100%
          clearInterval(progressInterval);
          setUploadProgress((prev) => ({ ...prev, [index]: 100 }));

          // Get current state to avoid race conditions
          const currentData = useEditDataStore.getState().mdaEditData;
          setMdaEditData({
            ...currentData,
            servicesData: currentData.servicesData.map((service, idx) =>
              idx === index ? { ...service, image: response.url } : service
            ),
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

  const addService = () => {
    setMdaEditData({
      ...mdaEditData,
      servicesData: [
        ...(mdaEditData.servicesData || []),
        {
          title: '',
          link: '',
          linkType: 'page',
        },
      ],
    });

    setTimeout(() => {
      const lastIndex = mdaEditData.servicesData?.length || 0;
      if (serviceRefs.current[lastIndex]) {
        serviceRefs.current[lastIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      } else if (containerRef.current) {
        // If specific element ref isn't available, scroll to bottom of container
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 50);
  };

  const removeService = (index) => {
    const updatedServices = [...mdaEditData.servicesData];
    updatedServices.splice(index, 1);

    setMdaEditData({
      ...mdaEditData,
      servicesData: updatedServices,
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
              mdaEditData.enabledSections?.quickServices ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                mdaEditData.enabledSections?.quickServices ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <BackgroundColorPicker value={backgroundColor} onChange={handleColorChange} />

      <div className="p-[30px]">
        <div className="flex flex-col gap-6">
          <div>
            <p className="font-semibold text-[14px] mb-3">Layout Style</p>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                className={`flex-1 py-2 px-3 rounded-md text-[12px] font-medium transition-all ${
                  style === 'default'
                    ? 'bg-white text-green-700 shadow-sm font-semibold'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setStyle('default')}
              >
                Photo Row
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-3 rounded-md text-[12px] font-medium transition-all ${
                  style === 'imageCards'
                    ? 'bg-white text-green-700 shadow-sm font-semibold'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setStyle('imageCards')}
              >
                Image Cards
              </button>
            </div>
          </div>

          {style === 'imageCards' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CTA Card Title
              </label>
              <textarea
                value={ctaTitle || ''}
                onChange={(e) => setCtaTitle(e.target.value)}
                className="focus:border-green-600 border-[1px] border-transparent w-full min-h-[70px] bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none resize-none"
                placeholder="Check out our citizens services"
              />
              <p className="text-[12px] text-gray-500 mt-1">
                Shown on the green card that links to the full services page
              </p>
            </div>
          )}

          <div className="flex justify-between items-center pb-6 w-full">
            <button
              onClick={addService}
              className="w-full px-5 py-3 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Add Service
            </button>
          </div>

          <div className="space-y-6">
            {mdaEditData.servicesData?.map((service, index) => {
              // Create a ref for each service item if it doesn't exist
              if (!serviceRefs.current[index]) {
                serviceRefs.current[index] = null;
              }

              return (
                <div
                  key={index}
                  ref={(ref) => (serviceRefs.current[index] = ref)}
                  className="flex gap-4 flex-col border-b border-gray-200 pb-6"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-[15px]">Service {index + 1}</h3>
                    <button
                      onClick={() => removeService(index)}
                      className="text-red-500 text-sm hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={service.title || ''}
                        onChange={(e) => handleChange(e, index)}
                        className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none"
                        placeholder="Service title"
                      />
                    </div>

                    {style === 'imageCards' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={service.description || ''}
                          onChange={(e) => handleChange(e, index)}
                          className="focus:border-green-600 border-[1px] border-transparent w-full min-h-[60px] bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none resize-none"
                          placeholder="Short description shown on the card"
                        />
                      </div>
                    )}

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">Link</label>
                        <div className="relative text-left flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setShowLinkTypeDropdown(showLinkTypeDropdown === index ? -1 : index)
                            }
                            className="inline-flex items-center text-xs text-gray-600 hover:text-gray-900"
                          >
                            {!service.linkType || service.linkType === 'page' ? (
                              <div className="flex gap-1">
                                {' '}
                                <span className="text-gray-600">
                                  <Link />
                                </span>{' '}
                                <p className="font-semibold">Page URL</p>
                              </div>
                            ) : service.linkType === 'phone' ? (
                              <div className="flex gap-1">
                                {' '}
                                <span className="text-gray-600">
                                  <Phone />
                                </span>{' '}
                                <p className="font-semibold">Phone Number</p>
                              </div>
                            ) : (
                              <div className="flex gap-1">
                                {' '}
                                <span className="text-gray-600">
                                  <Mail />
                                </span>{' '}
                                <p className="font-semibold">Email Address</p>
                              </div>
                            )}
                            <NavArrowDown className="ml-1 h-3 w-3" />
                          </button>

                          {showLinkTypeDropdown === index && (
                            <div className="origin-top-right absolute right-0 mt-1 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                              <div className="py-1">
                                <button
                                  type="button"
                                  className={`block w-full text-left px-4 py-2 text-sm ${
                                    service.linkType === 'page'
                                      ? 'bg-gray-100 text-gray-900'
                                      : 'text-gray-700'
                                  }`}
                                  onClick={() => {
                                    handleChange(
                                      { target: { name: 'linkType', value: 'page' } },
                                      index
                                    );
                                    setShowLinkTypeDropdown(-1);
                                  }}
                                >
                                  Page URL
                                </button>
                                <button
                                  type="button"
                                  className={`block w-full text-left px-4 py-2 text-sm ${
                                    service.linkType === 'phone'
                                      ? 'bg-gray-100 text-gray-900'
                                      : 'text-gray-700'
                                  }`}
                                  onClick={() => {
                                    handleChange(
                                      { target: { name: 'linkType', value: 'phone' } },
                                      index
                                    );
                                    setShowLinkTypeDropdown(-1);
                                  }}
                                >
                                  Phone Number
                                </button>
                                <button
                                  type="button"
                                  className={`block w-full text-left px-4 py-2 text-sm ${
                                    service.linkType === 'email'
                                      ? 'bg-gray-100 text-gray-900'
                                      : 'text-gray-700'
                                  }`}
                                  onClick={() => {
                                    handleChange(
                                      { target: { name: 'linkType', value: 'email' } },
                                      index
                                    );
                                    setShowLinkTypeDropdown(-1);
                                  }}
                                >
                                  Email Address
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <input
                          type={getLinkInputType(service.linkType)}
                          name="link"
                          value={service.link || ''}
                          onChange={(e) => handleChange(e, index)}
                          className={`focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none ${
                            service.link && !validateLink(service.link, service.linkType)
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                          }`}
                          placeholder={getLinkPlaceholder(service.linkType)}
                        />
                      </div>
                      {service.link && !validateLink(service.link, service.linkType) && (
                        <p className="mt-1 text-xs text-red-600">
                          {service.linkType === 'email'
                            ? 'Please enter a valid email address'
                            : 'Please enter a valid phone number'}
                        </p>
                      )}
                      <input type="hidden" name="formattedLink" value={getFormattedLink(service)} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                      <div className="mt-1 flex items-center">
                        <span className="inline-block h-12 w-12 overflow-hidden bg-gray-100 rounded-md relative">
                          {service.image ? (
                            <img
                              src={service.image}
                              alt="Service"
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
  );
};

export default QuickServicesEdit;
