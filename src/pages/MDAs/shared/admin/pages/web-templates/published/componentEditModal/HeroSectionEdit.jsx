import { Attachment, Link, Text } from 'iconoir-react';
import { useState } from 'react';
import { notify } from '../../../../../../../../utils/toast';
import { uploadFile } from '../../../../../../api/admin/content';
import { useEditDataStore } from '../../../../../../stores/editData.store';
import { useThemeStore } from '../../../../../../stores/theme.store';
import SectionTitle from './util/SectionTitle';

const HeroSectionEdit = () => {
  const { mdaEditData, setMdaEditData } = useEditDataStore();
  const { fullname } = useThemeStore((state) => state.mdaData);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const toggleSection = () => {
    setMdaEditData({
      ...mdaEditData,
      enabledSections: {
        ...mdaEditData.enabledSections,
        heroSection: !mdaEditData.enabledSections?.heroSection,
      },
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

      if (file.size > 2 * 1024 * 1024) {
        notify.error('File size must be less than 2MB');
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

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async (e) => {
        // Upload in background
        uploadFile({
          photo: {
            temp: name,
            data: e.target.result,
          },
        })
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
            }
          })
          .catch((err) => {
            clearInterval(progressInterval);
            notify.error(err.message);
            setIsUploading(false);
            setUploadProgress(0);
          });
      };
    });
  };

  return (
    <div className="fixed top-[145px] left-[280px] w-[350px] h-[calc(100vh-145px)] bg-white p-[30px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] z-90">
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
              <label htmlFor="action_button_link" className="text-[13px] font-medium text-gray-500">
                Button Link
              </label>
              <input
                name="action_button_link"
                type="text"
                className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none"
                placeholder="Enter button link"
                value={mdaEditData?.action_button_link}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* upload image */}
        <div className="flex gap-4 flex-col">
          <label htmlFor="" className="font-semibold text-[14px] flex gap-[1px] flex-col">
            <p className="flex gap-2 items-center">
              <Attachment /> Main Photo{' '}
              <button
                className="text-[13px] font-medium bg-green-600 text-white px-4 py-2 rounded-[6px] ml-auto cursor-pointer"
                onClick={(e) => handleUpload(e, `${fullname.replace(' ', '-')}-landing-page-image`)}
              >
                Upload
              </button>
              <input type="file" id="main_photo" onChange={handleUpload} hidden />
            </p>
          </label>
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
          <div className="h-[290px] w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center relative">
            <img src={mdaEditData.main_photo} alt="" className="h-full" />
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default HeroSectionEdit;
