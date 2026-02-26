import { Attachment } from 'iconoir-react';
import { useEditDataStore } from '../../../../../../stores/editData.store';
import { useThemeStore } from '../../../../../../stores/theme.store';
import SectionTitle from './util/SectionTitle';

const CommissionerZoneEdit = () => {
  const setMdaEditData = useEditDataStore((state) => state.setMdaEditData);
  const mdaEditData = useEditDataStore((state) => state.mdaEditData);
  const commissionersData = mdaEditData?.commissionersZone;
  const mdaData = useThemeStore((s) => s.mdaData);

  const handleChange = (e) => {
    setMdaEditData({
      ...mdaEditData,
      commissionersZone: {
        ...commissionersData,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleImageUpload = (e) => {
    e.preventDefault();
    const choosePhoto = document.getElementById('commissioner_image');
    choosePhoto.click();

    choosePhoto.addEventListener('change', (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        setMdaEditData({
          ...mdaEditData,
          commissionersZone: {
            ...commissionersData,
            commissionerImage: e.target.result,
          },
        });
      };
    });
  };

  console.log(mdaEditData);

  return (
    <div className="fixed top-[145px] left-[280px] w-[350px] h-[calc(100vh-145px)] bg-white overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] z-90">
      <SectionTitle />
      <div className="p-[30px] mt-[60px]">
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
            <div className="mt-1 flex items-center">
              <span className="inline-block h-32 w-32 overflow-hidden bg-gray-100 rounded-md">
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
