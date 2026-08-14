import { useRef } from 'react';
import { useEditDataStore } from '../../../../../../stores/editData.store';
import { useThemeStore } from '../../../../../../stores/theme.store';
import BackgroundColorPicker from '../../../../../colorPicker/BackgroundColorPicker';
import SectionTitle from './util/SectionTitle';

const StatisticsEdit = () => {
  const setMdaEditData = useEditDataStore((state) => state.setMdaEditData);
  const mdaEditData = useEditDataStore((state) => state.mdaEditData);
  const { fullname } = useThemeStore((s) => s.mdaData);
  const containerRef = useRef(null);

  const toggleSection = () => {
    setMdaEditData({
      ...mdaEditData,
      enabledSections: {
        ...mdaEditData.enabledSections,
        statistics: !mdaEditData.enabledSections?.statistics,
      },
    });
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedStatistics = [...(mdaEditData.statistics?.items || [])];
    updatedStatistics[index] = {
      ...updatedStatistics[index],
      [name]: value,
    };

    setMdaEditData({
      ...mdaEditData,
      statistics: {
        ...mdaEditData.statistics,
        items: updatedStatistics,
      },
    });
  };

  const backgroundColor = mdaEditData.statistics?.backgroundColor;

  const handleColorChange = (color) => {
    setMdaEditData({
      ...mdaEditData,
      statistics: {
        ...mdaEditData.statistics,
        backgroundColor: color,
      },
    });
  };

  const addStatistic = () => {
    const newStatistic = {
      label: '',
      value: '',
    };

    setMdaEditData({
      ...mdaEditData,
      statistics: {
        ...mdaEditData.statistics,
        items: [...(mdaEditData.statistics?.items || []), newStatistic],
      },
    });
  };

  const removeStatistic = (index) => {
    const updatedStatistics = [...(mdaEditData.statistics?.items || [])];
    updatedStatistics.splice(index, 1);

    setMdaEditData({
      ...mdaEditData,
      statistics: {
        ...mdaEditData.statistics,
        items: updatedStatistics,
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
              mdaEditData.enabledSections?.statistics ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                mdaEditData.enabledSections?.statistics ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <BackgroundColorPicker value={backgroundColor} onChange={handleColorChange} />

      <div className="p-[30px]" ref={containerRef}>
        <div className="flex flex-col gap-6">
          {/* Add Statistic Button */}
          <div className="flex justify-between items-center pb-2 w-full">
            <h3 className="font-semibold text-[15px]">Statistics Items</h3>
            <button
              onClick={addStatistic}
              className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Add Statistic
            </button>
          </div>

          {/* Statistics Items */}
          <div className="space-y-4">
            {mdaEditData.statistics?.items?.map((statistic, index) => (
              <div key={index} className="flex gap-4 flex-col border-b border-gray-200 pb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-[14px]">Statistic {index + 1}</h4>
                  <button
                    onClick={() => removeStatistic(index)}
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Statistic Label */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Statistic Label
                    </label>
                    <input
                      type="text"
                      name="label"
                      value={statistic.label || ''}
                      onChange={(e) => handleChange(e, index)}
                      className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none"
                      placeholder="e.g., 2024 Budget Size"
                    />
                  </div>

                  {/* Statistic Value */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Statistic Value
                    </label>
                    <input
                      type="text"
                      name="value"
                      value={statistic.value || ''}
                      onChange={(e) => handleChange(e, index)}
                      className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none"
                      placeholder="e.g., ₦2.5 Trillion"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Show default statistics if none exist */}
            {(!mdaEditData.statistics?.items || mdaEditData.statistics.items.length === 0) && (
              <div className="text-gray-500 text-sm text-center py-4">
                No statistics added yet. Click "Add Statistic" to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsEdit;
