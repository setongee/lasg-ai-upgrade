import extractYoutubeId from '../../../../../../../../utils/extractYoutubeId';
import { useEditDataStore } from '../../../../../../stores/editData.store';
import SectionTitle from './util/SectionTitle';

const YoutubePlayerEdit = () => {
  const setMdaEditData = useEditDataStore((state) => state.setMdaEditData);
  const mdaEditData = useEditDataStore((state) => state.mdaEditData);
  const youtubePlayerData = mdaEditData?.youtubePlayer || {};

  const toggleSection = () => {
    setMdaEditData({
      ...mdaEditData,
      enabledSections: {
        ...mdaEditData.enabledSections,
        youtubePlayer: !mdaEditData.enabledSections?.youtubePlayer,
      },
    });
  };

  const handleChange = (e) => {
    setMdaEditData({
      ...mdaEditData,
      youtubePlayer: {
        id: extractYoutubeId(e.target.value),
      },
    });
  };

  return (
    <div className="fixed top-[145px] left-[280px] w-[350px] h-[calc(100vh-145px)] bg-white overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] z-90">
      <SectionTitle />

      {/* Enable/Disable Toggle */}
      <div className="py-[20px] px-[30px] border-b border-gray-200 mt-[60px] bg-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Enable ySection</span>
          <button
            onClick={toggleSection}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              mdaEditData.enabledSections?.youtubePlayer ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                mdaEditData.enabledSections?.youtubePlayer ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="p-[30px] mt-[0px]">
        <form action="" className="flex flex-col gap-6">
          {/* YouTube Video ID */}
          <div className="flex gap-4 flex-col border-b border-gray-200 pb-6">
            <label htmlFor="id" className="font-semibold text-[14px] flex gap-[1px] flex-col">
              <p>YouTube Video ID</p>
              <span className="flex text-[13px] font-normal text-gray-500 items-center gap-1">
                The ID from the YouTube video URL (e.g., dQw4w9WgXcQ)
              </span>
            </label>
            <input
              type="text"
              name="id"
              id="youtubeId"
              className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none"
              placeholder="e.g., dQw4w9WgXcQ"
              value={youtubePlayerData?.id || ''}
              onChange={handleChange}
            />
          </div>

          {/* Preview Section */}
          {youtubePlayerData?.id && (
            <div className="flex gap-4 flex-col">
              <label className="font-semibold text-[14px] flex gap-[1px] flex-col">
                <p>Video Preview</p>
                <span className="flex text-[13px] font-normal text-gray-500 items-center gap-1">
                  This is how the video will appear on your site
                </span>
              </label>
              <div className="mt-2 w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubePlayerData.id}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default YoutubePlayerEdit;
