import { Attachment, Link, Plus, StarSolid, Text, Trash } from 'iconoir-react';
import { useState } from 'react';
import { notify } from '../../../../../../../../utils/toast';
import { uploadFileDirect } from '../../../../../../api/admin/content';
import { HERO_GRADIENT_PRESETS } from '../../../../../../shared/hero/heroGradients';
import { useEditDataStore } from '../../../../../../stores/editData.store';
import { useThemeStore } from '../../../../../../stores/theme.store';
import AiPhoto from '../../../../components/AiPhoto';
import SectionTitle from './util/SectionTitle';

const SITE_PAGES = [
  { label: 'Home', path: '' },
  { label: 'About', path: 'about' },
  { label: 'News', path: 'news' },
  { label: 'Resources', path: 'resources' },
  { label: 'Contact', path: 'contact' },
  { label: 'Forms', path: 'forms' },
];

const HERO_STYLE_OPTIONS = [
  { value: 'fullBleed', label: 'Full-width Image' },
  { value: 'boxedOverlay', label: 'Framed Overlay' },
  { value: 'splitPhoto', label: 'Side-by-side' },
  { value: 'splitTextImageBelow', label: 'Split Text, Image Below' },
  { value: 'centeredTextImageBelow', label: 'Centered, Image Below' },
  { value: 'fullBleedCentered', label: 'Full-width Image (Centered)' },
  { value: 'colorBackground', label: 'Full-screen Color' },
];

const HeroStylePreview = ({ style }) => {
  if (style === 'fullBleed') {
    return (
      <div className="relative w-full h-full bg-gray-400 rounded overflow-hidden">
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
          <div className="w-10 h-1.5 bg-white/90 rounded-full" />
          <div className="w-7 h-1.5 bg-white/70 rounded-full" />
        </div>
      </div>
    );
  }

  if (style === 'fullBleedCentered') {
    return (
      <div className="relative w-full h-full bg-gray-400 rounded overflow-hidden">
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <div className="w-10 h-1.5 bg-white/90 rounded-full" />
          <div className="w-7 h-1.5 bg-white/70 rounded-full" />
        </div>
      </div>
    );
  }

  if (style === 'boxedOverlay') {
    return (
      <div className="w-full h-full bg-gray-100 rounded flex items-center p-1.5">
        <div className="relative w-full h-full bg-gray-400 rounded overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
            <div className="w-9 h-1.5 bg-white/90 rounded-full" />
            <div className="w-6 h-1.5 bg-white/70 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (style === 'splitTextImageBelow') {
    return (
      <div className="w-full h-full flex flex-col gap-1">
        <div className="flex-1 flex gap-1.5 px-1">
          <div className="flex-1 flex flex-col justify-center gap-1">
            <div className="w-full h-1.5 bg-gray-500 rounded-full" />
          </div>
          <div className="flex-1 flex flex-col justify-center gap-1">
            <div className="w-full h-1 bg-gray-400 rounded-full" />
            <div className="w-6 h-1.5 bg-green-600 rounded-sm mt-0.5" />
          </div>
        </div>
        <div className="w-full flex-[1.4] bg-gray-400 rounded-t-sm" />
      </div>
    );
  }

  if (style === 'centeredTextImageBelow') {
    return (
      <div className="w-full h-full flex flex-col items-center gap-1">
        <div className="flex-1 flex flex-col items-center justify-center gap-1 w-full">
          <div className="w-1/2 h-1.5 bg-gray-500 rounded-full" />
          <div className="w-1/3 h-1 bg-gray-400 rounded-full" />
          <div className="w-6 h-1.5 bg-green-600 rounded-sm mt-0.5" />
        </div>
        <div className="w-full flex-[1.4] bg-gray-400 rounded-t-sm" />
      </div>
    );
  }

  if (style === 'colorBackground') {
    return (
      <div
        className="relative w-full h-full rounded overflow-hidden flex flex-col items-center justify-center gap-1"
        style={{ background: HERO_GRADIENT_PRESETS[0].css }}
      >
        <div className="w-10 h-1.5 bg-white/90 rounded-full" />
        <div className="w-7 h-1.5 bg-white/70 rounded-full" />
      </div>
    );
  }

  // splitPhoto
  return (
    <div className="w-full h-full flex gap-1.5">
      <div className="flex-1 flex flex-col justify-center gap-1.5 px-1">
        <div className="w-full h-1.5 bg-gray-500 rounded-full" />
        <div className="w-3/4 h-1.5 bg-gray-400 rounded-full" />
        <div className="w-6 h-2 bg-green-600 rounded-sm mt-1" />
      </div>
      <div className="flex-1 bg-gray-400 rounded" />
    </div>
  );
};

const HeroSectionEdit = () => {
  const { mdaEditData, setMdaEditData } = useEditDataStore();
  const { fullname, theme, slug: mdaSlug } = useThemeStore((state) => state.mdaData);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [useAiGeneration, setUseAiGeneration] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [linkMode, setLinkMode] = useState(() => {
    const link = mdaEditData?.action_button_link || '';
    return link === '' || link.startsWith('/') ? 'page' : 'custom';
  });

  const buildPageLink = (path) => (path ? `/${mdaSlug}/${path}` : `/${mdaSlug}`);

  const selectedPagePath =
    SITE_PAGES.find((p) => buildPageLink(p.path) === mdaEditData?.action_button_link)?.path ?? '';

  const handleSelectPage = (path) => {
    setMdaEditData({ ...mdaEditData, action_button_link: buildPageLink(path) });
  };

  const handleSwitchToPageMode = () => {
    setLinkMode('page');
    const isAlreadyInternal = SITE_PAGES.some(
      (p) => buildPageLink(p.path) === mdaEditData?.action_button_link
    );
    if (!isAlreadyInternal) {
      setMdaEditData({ ...mdaEditData, action_button_link: buildPageLink('') });
    }
  };

  const defaultHeroStyle = theme === 'mof' ? 'fullBleed' : 'splitPhoto';
  const heroStyle = mdaEditData?.hero_style || defaultHeroStyle;

  const setHeroStyle = (value) => {
    setMdaEditData({ ...mdaEditData, hero_style: value });
  };

  const isColorBackground = heroStyle === 'colorBackground';
  const bgType = mdaEditData?.hero_bg_type || 'gradient';
  const bgColor = mdaEditData?.hero_bg_color || '#0f9b6c';
  const bgGradient = mdaEditData?.hero_bg_gradient || HERO_GRADIENT_PRESETS[0].id;

  const setBgType = (value) => setMdaEditData({ ...mdaEditData, hero_bg_type: value });
  const setBgColor = (value) => setMdaEditData({ ...mdaEditData, hero_bg_color: value });
  const setBgGradient = (value) => setMdaEditData({ ...mdaEditData, hero_bg_gradient: value });

  const toggleSection = () => {
    setMdaEditData({
      ...mdaEditData,
      enabledSections: {
        ...mdaEditData.enabledSections,
        heroSection: !mdaEditData.enabledSections?.heroSection,
      },
    });
  };

  const slideshowEnabled = !!mdaEditData?.hero_slideshow;
  const heroImages = mdaEditData?.hero_images?.length ? mdaEditData.hero_images : [''];
  const [uploadingSlides, setUploadingSlides] = useState({});

  const toggleSlideshow = () => {
    setMdaEditData({ ...mdaEditData, hero_slideshow: !slideshowEnabled });
  };

  const updateHeroImages = (nextImages) => {
    setMdaEditData({ ...mdaEditData, hero_images: nextImages });
  };

  const addSlide = () => updateHeroImages([...heroImages, '']);

  const removeSlide = (index) => {
    const next = heroImages.filter((_, i) => i !== index);
    updateHeroImages(next.length ? next : ['']);
  };

  const handleSlideUpload = (index, file) => {
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      notify.error('File size must be less than 50MB');
      return;
    }

    const blobUrl = URL.createObjectURL(file);
    const withPreview = [...heroImages];
    withPreview[index] = blobUrl;
    updateHeroImages(withPreview);

    setUploadingSlides((prev) => ({ ...prev, [index]: true }));

    uploadFileDirect(file, `${fullname.replace(' ', '-')}-hero-slide-${index}`)
      .then((response) => {
        if (response.status === 'ok') {
          const withUploaded = [
            ...(mdaEditData.hero_images?.length ? mdaEditData.hero_images : ['']),
          ];
          withUploaded[index] = response.url;
          updateHeroImages(withUploaded);
        } else {
          notify.error(response.message || 'Failed to upload image. Please try again.');
        }
      })
      .catch((err) => {
        notify.error(err?.message || 'Failed to upload image. Please try again.');
      })
      .finally(() => {
        setUploadingSlides((prev) => {
          const next = { ...prev };
          delete next[index];
          return next;
        });
      });
  };

  const handleChange = (e) => {
    setMdaEditData({
      ...mdaEditData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpload = async (e, name) => {
    e.preventDefault();
    const choosePhoto = document.getElementById('main_photo');
    choosePhoto.click();

    choosePhoto.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 50 * 1024 * 1024) {
        notify.error('File size must be less than 50MB');
        return;
      }

      const blobUrl = URL.createObjectURL(file);
      // Immediately update the image with blob for instant preview
      setMdaEditData({ ...mdaEditData, main_photo: blobUrl });

      setIsUploading(true);
      setUploadProgress(0);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev < 90) {
            return Math.min(prev + Math.random() * 15, 90);
          }
          return prev;
        });
      }, 200);

      // Upload directly to Cloudinary (bypasses our server entirely for the file bytes)
      uploadFileDirect(file, name)
        .then((response) => {
          if (response.status === 'ok') {
            // Clear interval and set to 100%
            clearInterval(progressInterval);
            setUploadProgress(100);

            setMdaEditData({ ...mdaEditData, main_photo: response.url });

            // Clean up after a short delay
            setTimeout(() => {
              setIsUploading(false);
              setUploadProgress(0);
            }, 500);
          } else {
            clearInterval(progressInterval);
            notify.error(response.message || 'Failed to upload image. Please try again.');
            setIsUploading(false);
            setUploadProgress(0);
          }
        })
        .catch((err) => {
          clearInterval(progressInterval);
          notify.error(err.message);
          setIsUploading(false);
          setUploadProgress(0);
        });
    });
  };

  return (
    <div className="fixed top-[145px] left-0 w-[350px] h-[calc(100vh-145px)] bg-white p-[30px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] z-90">
      {/* section title */}
      <SectionTitle />

      {/* Enable/Disable Toggle */}
      <div className="py-[20px] px-[30px] border-b border-gray-200 mt-[30px] bg-gray-100 -mx-[30px]">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Enable Section</span>
          <button
            onClick={toggleSection}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              mdaEditData.enabledSections?.heroSection ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                mdaEditData.enabledSections?.heroSection ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Hero Style Picker */}
      <div className="pt-[20px]">
        <p className="font-semibold text-[14px] mb-3">Hero Style</p>
        <div className="grid grid-cols-3 gap-2">
          {HERO_STYLE_OPTIONS.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => setHeroStyle(option.value)}
              className={`flex flex-col gap-2 p-2 rounded-lg border-2 transition-colors text-left ${
                heroStyle === option.value
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-full h-[50px]">
                <HeroStylePreview style={option.value} />
              </div>
              <span className="text-[11px] font-medium text-gray-700 leading-tight">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* form */}
      <form action="" className="flex flex-col gap-6 mt-[30px]">
        <div className="flex gap-4 flex-col border-b border-gray-200 pb-6">
          <label htmlFor="hero-text" className="font-semibold text-[14px] flex gap-[1px] flex-col">
            <div>
              <p className="flex gap-2">
                <Text /> Hero Text{' '}
                <span className="italic font-normal text-[13px] text-gray-500">(max 7 words)</span>
              </p>
            </div>
            <span className=" flex text-[13px] font-normal text-gray-500 items-center gap-1">
              {' '}
              This is the main hero section text
            </span>
          </label>
          <textarea
            name="hero_text"
            id="hero_text"
            className="focus:border-green-600 border-[1px] border-transparent w-full min-h-[80px] field-sizing-content bg-gray-100 p-4 text-[14px] resize-none outline-none rounded-lg"
            placeholder="Enter hero text"
            value={mdaEditData?.hero_text}
            onChange={handleChange}
          />
        </div>
        <div className="flex gap-4 flex-col border-b border-gray-200 pb-6">
          <label
            htmlFor="hero_subtitle"
            className="font-semibold text-[14px] flex gap-[1px] flex-col"
          >
            <div>
              <p className="flex gap-2">
                <Text /> Hero Subtitle{' '}
              </p>
              <span className=" flex text-[13px] font-normal text-gray-500 items-center gap-1">
                {' '}
                This is the subtitle of the hero section
              </span>
            </div>
          </label>
          <textarea
            name="hero_subtitle"
            id="hero_subtitle"
            className="focus:border-green-600 border-[1px] border-transparent w-full min-h-[100px] field-sizing-content bg-gray-100 p-4 text-[14px] resize-none outline-none rounded-lg"
            placeholder="Enter hero subtitle"
            value={mdaEditData?.hero_subtitle}
            onChange={handleChange}
          />
        </div>

        {/* landing page button */}
        <div className="flex gap-4 flex-col border-b border-gray-200 pb-6">
          <label
            htmlFor="action_button_text"
            className="font-semibold text-[14px] flex gap-[1px] flex-col"
          >
            <div>
              <p className="flex gap-2">
                <Link /> Action Button{' '}
              </p>
              <span className=" flex text-[13px] font-normal text-gray-500 items-center gap-1">
                {' '}
                This is the action button of the hero section
              </span>
            </div>
          </label>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="action_button_text" className="text-[13px] font-medium text-gray-500">
                Button Text
              </label>
              <input
                name="action_button_text"
                type="text"
                className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none"
                placeholder="Enter button text"
                value={mdaEditData?.action_button_text}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-gray-500">Button Link</label>

              {/* Mode tab switcher */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  className={`flex-1 py-2 px-3 rounded-md text-[12px] font-medium transition-all ${
                    linkMode === 'page'
                      ? 'bg-white text-green-700 shadow-sm font-semibold'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={handleSwitchToPageMode}
                >
                  Site Page
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-3 rounded-md text-[12px] font-medium transition-all ${
                    linkMode === 'custom'
                      ? 'bg-white text-green-700 shadow-sm font-semibold'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setLinkMode('custom')}
                >
                  Custom URL
                </button>
              </div>

              {linkMode === 'page' ? (
                <select
                  className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none"
                  value={selectedPagePath}
                  onChange={(e) => handleSelectPage(e.target.value)}
                >
                  {SITE_PAGES.map((p) => (
                    <option key={p.path} value={p.path}>
                      {p.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name="action_button_link"
                  type="text"
                  className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none"
                  placeholder="https://example.com or #section-id"
                  value={mdaEditData?.action_button_link || ''}
                  onChange={handleChange}
                />
              )}
            </div>
          </div>
        </div>

        {isColorBackground ? (
          <div className="flex gap-4 flex-col">
            <label className="font-semibold text-[14px] flex gap-[1px] flex-col">
              <p className="flex gap-2 items-center">Background</p>
              <span className="text-[13px] font-normal text-gray-500">
                Choose a solid color or one of the preset gradients
              </span>
            </label>

            {/* Solid vs Gradient tab switcher */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                className={`flex-1 py-2 px-3 rounded-md text-[12px] font-medium transition-all ${
                  bgType === 'gradient'
                    ? 'bg-white text-green-700 shadow-sm font-semibold'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setBgType('gradient')}
              >
                Gradient
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-3 rounded-md text-[12px] font-medium transition-all ${
                  bgType === 'solid'
                    ? 'bg-white text-green-700 shadow-sm font-semibold'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setBgType('solid')}
              >
                Solid Color
              </button>
            </div>

            {bgType === 'solid' ? (
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer p-0.5 shrink-0"
                  aria-label="Choose custom color"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  placeholder="#0f9b6c"
                  className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none"
                />
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {HERO_GRADIENT_PRESETS.map((preset) => (
                  <button
                    type="button"
                    key={preset.id}
                    onClick={() => setBgGradient(preset.id)}
                    title={preset.label}
                    className={`h-12 rounded-lg border-2 transition-colors ${
                      bgGradient === preset.id
                        ? 'border-green-600 ring-2 ring-green-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ background: preset.css }}
                    aria-label={preset.label}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* slideshow toggle */}
            <div className="flex items-center justify-between py-4 px-[30px] -mx-[30px] border-y border-gray-200 bg-gray-50">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">Enable Image Slideshow</span>
                <span className="text-[12px] text-gray-500">Cycle through multiple images</span>
              </div>
              <button
                type="button"
                onClick={toggleSlideshow}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 ${
                  slideshowEnabled ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    slideshowEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {slideshowEnabled ? (
              <div className="flex gap-4 flex-col">
                <label className="font-semibold text-[14px] flex gap-[1px] flex-col">
                  <p className="flex gap-2 items-center">
                    <Attachment /> Slideshow Images{' '}
                  </p>
                  <span className="text-[13px] font-normal text-gray-500">
                    The first image is shown while others load; if slideshow is turned off later,
                    the first image becomes the main photo.
                  </span>
                </label>

                {heroImages.map((img, i) => {
                  const isUploadingSlide = !!uploadingSlides[i];
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="relative w-[56px] h-[56px] rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                        {img ? (
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Attachment className="text-gray-400" />
                        )}
                        {isUploadingSlide && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        id={`hero_slide_${i}`}
                        accept="image/*"
                        hidden
                        onChange={(e) => handleSlideUpload(i, e.target.files[0])}
                      />
                      <button
                        type="button"
                        disabled={isUploadingSlide}
                        className="text-[13px] font-medium bg-gray-100 text-gray-700 px-3 py-2 rounded-[6px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => document.getElementById(`hero_slide_${i}`).click()}
                      >
                        {isUploadingSlide ? 'Uploading...' : img ? 'Change' : 'Upload'}
                      </button>
                      {heroImages.length > 1 && (
                        <button
                          type="button"
                          disabled={isUploadingSlide}
                          className="ml-auto text-gray-400 hover:text-red-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => removeSlide(i)}
                          aria-label="Remove image"
                        >
                          <Trash width={16} />
                        </button>
                      )}
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={addSlide}
                  className="text-[13px] font-medium text-green-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus width={16} /> Add Image
                </button>
              </div>
            ) : (
              <div className="flex gap-4 flex-col">
                <label htmlFor="" className="font-semibold text-[14px] flex gap-[1px] flex-col">
                  <p className="flex gap-2 items-center">
                    <Attachment /> Main Photo{' '}
                  </p>
                </label>

                {/* Tab Switcher */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 rounded-md text-[13px] font-medium transition-all ${
                      !useAiGeneration
                        ? 'bg-white text-green-700 shadow-sm font-semibold'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setUseAiGeneration(false)}
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 rounded-md text-[13px] font-medium transition-all flex items-center justify-center gap-1 ${
                      useAiGeneration
                        ? 'bg-white text-green-700 shadow-sm font-semibold'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setUseAiGeneration(true)}
                  >
                    <StarSolid className="w-3 h-3" />
                    AI Generate
                  </button>
                </div>

                {/* AI Generation Interface */}
                {useAiGeneration && (
                  <AiPhoto
                    onImageGenerated={(imageUrl) =>
                      setMdaEditData({ ...mdaEditData, main_photo: imageUrl })
                    }
                    mdaFullName={fullname}
                    onLoadingChange={setIsAiGenerating}
                  />
                )}

                {/* Local Upload Interface */}
                {!useAiGeneration && (
                  <>
                    <input type="file" id="main_photo" onChange={handleUpload} hidden />
                    <button
                      type="button"
                      className="text-[13px] font-medium bg-green-600 text-white px-4 py-2 rounded-[6px] cursor-pointer w-full"
                      onClick={(e) =>
                        handleUpload(e, `${fullname.replace(' ', '-')}-landing-page-image`)
                      }
                    >
                      Choose File to Upload
                    </button>
                  </>
                )}

                {/* Upload Progress */}
                {isUploading && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Uploading...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-green-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Image Preview */}
                <div className="h-[290px] w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center relative">
                  <img src={mdaEditData.main_photo} alt="" className="h-full w-full object-cover" />
                  {(isUploading || isAiGenerating) && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </form>
    </div>
  );
};

export default HeroSectionEdit;
