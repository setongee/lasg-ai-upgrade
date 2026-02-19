import { Attachment, Link, Text } from 'iconoir-react';
import { useEditDataStore } from '../../../../../../stores/editData.store';
import SectionTitle from './util/SectionTitle';

const HeroSectionEdit = () => {
  const { mdaEditData, setMdaEditData } = useEditDataStore();

  const handleChange = (e) => {
    setMdaEditData({
      ...mdaEditData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpload = (e) => {
    e.preventDefault();
    const choosePhoto = document.getElementById('main_photo');
    choosePhoto.click();

    choosePhoto.addEventListener('change', (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        setMdaEditData({
          ...mdaEditData,
          main_photo: e.target.result,
        });
      };
    });
  };

  return (
    <div className="fixed top-[145px] left-[280px] w-[350px] h-[calc(100vh-145px)] bg-white p-[30px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] z-90">
      {/* section title */}
      <SectionTitle />

      {/* form */}
      <form action="" className="flex flex-col gap-6 mt-[60px]">
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
                onClick={handleUpload}
              >
                Upload
              </button>
              <input type="file" id="main_photo" onChange={handleUpload} hidden />
            </p>
          </label>
          <div className="h-[290px] w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            <img src={mdaEditData.main_photo} alt="" className="h-full" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default HeroSectionEdit;
