import { Attachment } from 'iconoir-react';
import { useState } from 'react';
import { notify } from '../../../../../../../../utils/toast';
import { uploadFile } from '../../../../../../api/admin/content';
import { useEditDataStore } from '../../../../../../stores/editData.store';
import { useThemeStore } from '../../../../../../stores/theme.store';
import SectionTitle from './util/SectionTitle';

const CommissionerZoneEdit = () => {
  const setMdaEditData = useEditDataStore((state) => state.setMdaEditData);
  const mdaEditData = useEditDataStore((state) => state.mdaEditData);
  const commissionersData = mdaEditData?.commissionersZone;
  const mdaData = useThemeStore((s) => s.mdaData);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    setMdaEditData({
      ...mdaEditData,
      commissionersZone: {
        ...commissionersData,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    const choosePhoto = document.getElementById('commissioner_image');
    choosePhoto.click();

    choosePhoto.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        notify.error('File size must be less than 2MB');
        return;
      }

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
        // Immediately update the image with base64 for instant preview
        setMdaEditData({
          ...mdaEditData,
          commissionersZone: {
            ...commissionersData,
            commissionerImage: e.target.result,
          },
        });

        // Upload in background
        await uploadFile({
          photo: {
            temp: `${mdaData?.fullname?.replace(' ', '-')}-commissioner-photo`,
            data: e.target.result,
          },
        })
          .then((response) => {
            if (response.status === 'ok') {
              // Clear interval and set to 100%
              clearInterval(progressInterval);
              setUploadProgress(100);

              setMdaEditData({
                ...mdaEditData,
                commissionersZone: {
                  ...commissionersData,
                  commissionerImage: response.url,
                },
              });

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

  const toggleSection = () => {
    setMdaEditData({
      ...mdaEditData,
      enabledSections: {
        ...mdaEditData.enabledSections,
        commissionersZone: !mdaEditData.enabledSections?.commissionersZone,
      },
    });
  };

  mdaEditData;

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
              mdaEditData.enabledSections?.commissionersZone ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                mdaEditData.enabledSections?.commissionersZone ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="p-[30px]">
        <form action="" className="flex flex-col gap-6">
          {/* Welcome Title */}
          <div className="flex gap-4 flex-col border-b border-gray-200 pb-6">
            <label
              htmlFor="welcomeTitle"
              className="font-semibold text-[14px] flex gap-[1px] flex-col"
            >
              <p>Welcome Title</p>
              <span className="flex text-[13px] font-normal text-gray-500 items-center gap-1">
                Main heading for the commissioner's welcome section
              </span>
            </label>
            <input
              type="text"
              name="welcomeTitle"
              id="welcomeTitle"
              className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none"
              placeholder="e.g., Welcome to Lagos State Ministry of Health"
              value={commissionersData?.welcomeTitle || ''}
              onChange={handleChange}
            />
          </div>

          {/* Welcome Message */}
          <div className="flex gap-4 flex-col border-b border-gray-200 pb-6">
            <label
              htmlFor="welcomeMessage"
              className="font-semibold text-[14px] flex gap-[1px] flex-col"
            >
              <p>Welcome Message</p>
              <span className="flex text-[13px] font-normal text-gray-500 items-center gap-1">
                Commissioner's welcome message
              </span>
            </label>
            <textarea
              name="welcomeMessage"
              id="welcomeMessage"
              className="focus:border-green-600 border-[1px] border-transparent w-full min-h-[150px] bg-gray-100 p-4 text-[14px] resize-none outline-none rounded-lg"
              placeholder="Enter the commissioner's welcome message"
              value={commissionersData?.welcomeMessage || ''}
              onChange={handleChange}
            />
          </div>

          {/* Commissioner Name */}
          <div className="flex gap-4 flex-col border-b border-gray-200 pb-6">
            <label
              htmlFor="commissionerName"
              className="font-semibold text-[14px] flex gap-[1px] flex-col"
            >
              <p>Commissioner's Name</p>
              <span className="flex text-[13px] font-normal text-gray-500 items-center gap-1">
                Full name of the commissioner
              </span>
            </label>
            <input
              type="text"
              name="commissionerName"
              id="commissionerName"
              className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none"
              placeholder="e.g., Prof. John Doe"
              value={commissionersData?.commissionerName || ''}
              onChange={handleChange}
            />
          </div>

          {/* Commissioner Title */}
          <div className="flex gap-4 flex-col border-b border-gray-200 pb-6">
            <label
              htmlFor="commissionerTitle"
              className="font-semibold text-[14px] flex gap-[1px] flex-col"
            >
              <p>Commissioner's Title</p>
              <span className="flex text-[13px] font-normal text-gray-500 items-center gap-1">
                Official title/position
              </span>
            </label>
            <input
              type="text"
              name="commissionerTitle"
              id="commissionerTitle"
              className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none"
              placeholder={`e.g., Hon. Commissioner for ${mdaData?.fullname}, Lagos State`}
              value={commissionersData?.commissionerTitle || ''}
              onChange={handleChange}
            />
          </div>

          {/* Commissioner Image */}
          <div className="flex gap-4 flex-col">
            <label htmlFor="" className="font-semibold text-[14px] flex gap-[1px] flex-col">
              <p>Commissioner's Photo</p>
              <span className="flex text-[13px] font-normal text-gray-500 items-center gap-1">
                Recommended size: 600x580px
              </span>
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
            <div className="mt-1 flex items-center">
              <span className="inline-block h-32 w-32 overflow-hidden bg-gray-100 rounded-md relative">
                {commissionersData?.commissionerImage ? (
                  <img
                    src={commissionersData?.commissionerImage}
                    alt="Commissioner"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    <Attachment className="text-gray-500" />
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </span>
              <label className="ml-4">
                <div className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-xs text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
                  Change Photo
                </div>
                <input
                  type="file"
                  id="commissioner_image"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommissionerZoneEdit;
