import { Link, NavArrowDown, Phone, Mail } from 'iconoir-react';
import { useRef, useState } from 'react';
import { notify } from '../../../../../../../../utils/toast';
import { useEditDataStore } from '../../../../../../stores/editData.store';
import { useThemeStore } from '../../../../../../stores/theme.store';
import BackgroundColorPicker from '../../../../../colorPicker/BackgroundColorPicker';
import SectionTitle from './util/SectionTitle';

const SupportLinksEdit = () => {
  const setMdaEditData = useEditDataStore((state) => state.setMdaEditData);
  const mdaEditData = useEditDataStore((state) => state.mdaEditData);
  const [showLinkTypeDropdown, setShowLinkTypeDropdown] = useState(-1);
  const supportLinkRefs = useRef([]);
  const containerRef = useRef(null);

  const toggleSection = () => {
    setMdaEditData({
      ...mdaEditData,
      enabledSections: {
        ...mdaEditData.enabledSections,
        supportLinks: !mdaEditData.enabledSections?.supportLinks,
      },
    });
  };

  const backgroundColor = mdaEditData.supportLinksSettings?.backgroundColor;

  const handleColorChange = (color) => {
    setMdaEditData({
      ...mdaEditData,
      supportLinksSettings: {
        ...mdaEditData.supportLinksSettings,
        backgroundColor: color,
      },
    });
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedSupportLinks = [...(mdaEditData.supportLinks || [])];

    // If link type is changed, reset the link value
    if (name === 'linkType') {
      updatedSupportLinks[index] = {
        ...updatedSupportLinks[index],
        linkType: value,
        link: '',
      };
    } else {
      updatedSupportLinks[index] = {
        ...updatedSupportLinks[index],
        [name]: value,
      };
    }

    setMdaEditData({
      ...mdaEditData,
      supportLinks: updatedSupportLinks,
    });
  };

  const getFormattedLink = (supportLink) => {
    if (!supportLink.link) return '';

    switch (supportLink.linkType) {
      case 'phone':
        return `tel:${supportLink.link.replace(/[^0-9+]/g, '')}`;
      case 'email':
        return `mailto:${supportLink.link}`;
      default:
        return supportLink.link;
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

  const addSupportLink = () => {
    setMdaEditData({
      ...mdaEditData,
      supportLinks: [
        ...(mdaEditData.supportLinks || []),
        {
          text: '',
          link: '',
          linkType: 'page',
        },
      ],
    });

    setTimeout(() => {
      const lastIndex = mdaEditData.supportLinks?.length || 0;
      if (supportLinkRefs.current[lastIndex]) {
        supportLinkRefs.current[lastIndex].scrollIntoView({
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

  const removeSupportLink = (index) => {
    const updatedLinks = [...(mdaEditData.supportLinks || [])];
    updatedLinks.splice(index, 1);

    setMdaEditData({
      ...mdaEditData,
      supportLinks: updatedLinks,
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
              mdaEditData.enabledSections?.supportLinks ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                mdaEditData.enabledSections?.supportLinks ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <BackgroundColorPicker value={backgroundColor} onChange={handleColorChange} />

      <div className="p-[30px]" ref={containerRef}>
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center pb-6 w-full">
            <button
              onClick={addSupportLink}
              className="w-full px-5 py-3 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Add Support Link
            </button>
          </div>

          <div className="space-y-6">
            {mdaEditData.supportLinks?.map((supportLink, index) => {
              // Create a ref for each support link item if it doesn't exist
              if (!supportLinkRefs.current[index]) {
                supportLinkRefs.current[index] = null;
              }

              return (
                <div
                  key={index}
                  ref={(ref) => (supportLinkRefs.current[index] = ref)}
                  className="flex gap-4 flex-col border-b border-gray-200 pb-6"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-[15px]">Support Link {index + 1}</h3>
                    <button
                      onClick={() => removeSupportLink(index)}
                      className="text-red-500 text-sm hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Link Text</label>
                      <input
                        type="text"
                        name="text"
                        value={supportLink.text || ''}
                        onChange={(e) => handleChange(e, index)}
                        className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none"
                        placeholder="e.g., Contact Support, Help Center, FAQ"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">Link URL</label>
                        <div className="relative text-left flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setShowLinkTypeDropdown(showLinkTypeDropdown === index ? -1 : index)
                            }
                            className="inline-flex items-center text-xs text-gray-600 hover:text-gray-900"
                          >
                            {!supportLink.linkType || supportLink.linkType === 'page' ? (
                              <div className="flex gap-1">
                                {' '}
                                <span className="text-gray-600">
                                  <Link />
                                </span>{' '}
                                <p className="font-semibold">Page URL</p>
                              </div>
                            ) : supportLink.linkType === 'phone' ? (
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
                                    supportLink.linkType === 'page'
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
                                    supportLink.linkType === 'phone'
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
                                    supportLink.linkType === 'email'
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
                          type={getLinkInputType(supportLink.linkType)}
                          name="link"
                          value={supportLink.link || ''}
                          onChange={(e) => handleChange(e, index)}
                          className={`focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none ${
                            supportLink.link && !validateLink(supportLink.link, supportLink.linkType)
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                          }`}
                          placeholder={getLinkPlaceholder(supportLink.linkType)}
                        />
                      </div>
                      {supportLink.link && !validateLink(supportLink.link, supportLink.linkType) && (
                        <p className="mt-1 text-xs text-red-600">
                          {supportLink.linkType === 'email'
                            ? 'Please enter a valid email address'
                            : 'Please enter a valid phone number'}
                        </p>
                      )}
                      <input type="hidden" name="formattedLink" value={getFormattedLink(supportLink)} />
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

export default SupportLinksEdit;
