import { useEditDataStore } from '../../../../../../stores/editData.store';
import BackgroundColorPicker from '../../../../../colorPicker/BackgroundColorPicker';
import SectionTitle from './util/SectionTitle';

const GalleryPreviewEdit = () => {
  const { mdaEditData, setMdaEditData } = useEditDataStore();
  const isEnabled = mdaEditData.enabledSections?.galleryPreview !== false;
  const backgroundColor = mdaEditData.galleryPreview?.backgroundColor;

  const toggleSection = () => {
    setMdaEditData({
      ...mdaEditData,
      enabledSections: {
        ...mdaEditData.enabledSections,
        galleryPreview: !isEnabled,
      },
    });
  };

  const handleColorChange = (color) => {
    setMdaEditData({
      ...mdaEditData,
      galleryPreview: {
        ...mdaEditData.galleryPreview,
        backgroundColor: color,
      },
    });
  };

  return (
    <div className="fixed top-[145px] left-0 w-[350px] h-[calc(100vh-145px)] bg-white p-[30px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] z-90">
      <SectionTitle />

      <div className="py-[20px] px-[30px] border-b border-gray-200 mt-[30px] bg-gray-100 -mx-[30px]">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Enable Section</span>
          <button
            onClick={toggleSection}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              isEnabled ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="-mx-[30px]">
        <BackgroundColorPicker value={backgroundColor} onChange={handleColorChange} />
      </div>

      <p className="text-[13px] text-gray-500 leading-[1.6] mt-6">
        This section automatically shows your 3 most recent photo albums, and disappears on its
        own if you haven't added any yet. To add or manage albums, go to{' '}
        <span className="font-semibold text-gray-700">Gallery</span> in the sidebar.
      </p>
    </div>
  );
};

export default GalleryPreviewEdit;
