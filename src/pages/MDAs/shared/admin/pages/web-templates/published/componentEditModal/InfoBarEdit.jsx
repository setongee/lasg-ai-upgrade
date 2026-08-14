import { useRef } from 'react';
import { useEditDataStore } from '../../../../../../stores/editData.store';
import { useThemeStore } from '../../../../../../stores/theme.store';
import SectionTitle from './util/SectionTitle';

const InfoBarEdit = () => {
  const { mdaEditData, setMdaEditData } = useEditDataStore();
  const { fullname } = useThemeStore((s) => s.mdaData);
  const messageRefs = useRef([]);
  const containerRef = useRef(null);

  const isEnabled = mdaEditData.infoBar?.enabled !== false;
  const sliderEnabled = !!mdaEditData.infoBar?.sliderEnabled;
  const messages = mdaEditData.infoBar?.messages || [];

  const toggleSection = () => {
    setMdaEditData({
      ...mdaEditData,
      infoBar: {
        ...mdaEditData.infoBar,
        enabled: !isEnabled,
      },
    });
  };

  const toggleSlider = () => {
    setMdaEditData({
      ...mdaEditData,
      infoBar: {
        ...mdaEditData.infoBar,
        sliderEnabled: !sliderEnabled,
      },
    });
  };

  const handleChange = (e, index) => {
    const updated = [...messages];
    updated[index] = e.target.value;

    setMdaEditData({
      ...mdaEditData,
      infoBar: {
        ...mdaEditData.infoBar,
        messages: updated,
      },
    });
  };

  const addMessage = () => {
    setMdaEditData({
      ...mdaEditData,
      infoBar: {
        ...mdaEditData.infoBar,
        messages: [...messages, ''],
      },
    });

    setTimeout(() => {
      const lastIndex = messages.length;
      if (messageRefs.current[lastIndex]) {
        messageRefs.current[lastIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else if (containerRef.current) {
        containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
      }
    }, 50);
  };

  const removeMessage = (index) => {
    const updated = [...messages];
    updated.splice(index, 1);

    setMdaEditData({
      ...mdaEditData,
      infoBar: {
        ...mdaEditData.infoBar,
        messages: updated,
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

      {/* Slider Toggle */}
      <div className="py-[20px] px-[30px] border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-700 block">Enable Slider</span>
            <span className="text-xs text-gray-400">Rotate through messages automatically</span>
          </div>
          <button
            onClick={toggleSlider}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 ml-3 ${
              sliderEnabled ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                sliderEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="p-[30px]" ref={containerRef}>
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center pb-2 w-full">
            <h3 className="font-semibold text-[15px]">Messages</h3>
            <button
              onClick={addMessage}
              className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Add Message
            </button>
          </div>

          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                ref={(ref) => (messageRefs.current[index] = ref)}
                className="flex gap-2 items-start border-b border-gray-200 pb-4"
              >
                <input
                  type="text"
                  value={message}
                  onChange={(e) => handleChange(e, index)}
                  className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none"
                  placeholder={`e.g., Welcome to ${fullname || 'us'}`}
                />
                <button
                  onClick={() => removeMessage(index)}
                  className="text-red-500 text-sm hover:text-red-700 shrink-0 py-3"
                >
                  Remove
                </button>
              </div>
            ))}

            {messages.length === 0 && (
              <div className="text-gray-500 text-sm text-center py-4">
                No messages added yet — defaults to "Welcome to {fullname || 'us'}".
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoBarEdit;
