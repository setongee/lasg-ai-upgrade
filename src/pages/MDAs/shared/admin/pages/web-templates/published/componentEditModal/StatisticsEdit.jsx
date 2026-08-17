import { Attachment } from 'iconoir-react';
import { useRef, useState } from 'react';
import { notify } from '../../../../../../../../utils/toast';
import { uploadFileDirect } from '../../../../../../api/admin/content';
import { useEditDataStore } from '../../../../../../stores/editData.store';
import { useThemeStore } from '../../../../../../stores/theme.store';
import BackgroundColorPicker from '../../../../../colorPicker/BackgroundColorPicker';
import SectionTitle from './util/SectionTitle';

const STATISTICS_STYLE_OPTIONS = [
  { value: 'style1', label: 'Number Row' },
  { value: 'style2', label: 'Icon Cards' },
];

const StatisticsStylePreview = ({ style }) => {
  if (style === 'style2') {
    return (
      <div className="w-full h-full grid grid-cols-3 gap-1 p-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded bg-gray-300 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-white" />
          </div>
        ))}
      </div>
    );
  }

  // style1
  return (
    <div className="w-full h-full flex items-center justify-center gap-2 px-1">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div className="w-6 h-1.5 bg-gray-500 rounded-full" />
          <div className="w-8 h-1 bg-gray-300 rounded-full" />
        </div>
      ))}
    </div>
  );
};

const StatisticsEdit = () => {
  const setMdaEditData = useEditDataStore((state) => state.setMdaEditData);
  const mdaEditData = useEditDataStore((state) => state.mdaEditData);
  const { fullname } = useThemeStore((s) => s.mdaData);
  const containerRef = useRef(null);
  const [uploadingIcons, setUploadingIcons] = useState({});

  const statisticsStyle = mdaEditData?.statistics_style || 'style1';
  const setStatisticsStyle = (value) => {
    setMdaEditData({ ...mdaEditData, statistics_style: value });
  };

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
      icon: '',
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

  const handleIconUpload = (index, file) => {
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      notify.error('File size must be less than 50MB');
      return;
    }

    const blobUrl = URL.createObjectURL(file);
    const withPreview = [...(mdaEditData.statistics?.items || [])];
    withPreview[index] = { ...withPreview[index], icon: blobUrl };
    setMdaEditData({
      ...mdaEditData,
      statistics: { ...mdaEditData.statistics, items: withPreview },
    });

    setUploadingIcons((prev) => ({ ...prev, [index]: true }));

    uploadFileDirect(file, `${fullname.replace(' ', '-')}-statistic-icon-${index}`)
      .then((response) => {
        if (response.status === 'ok') {
          const withUploaded = [...(mdaEditData.statistics?.items || [])];
          withUploaded[index] = { ...withUploaded[index], icon: response.url };
          setMdaEditData({
            ...mdaEditData,
            statistics: { ...mdaEditData.statistics, items: withUploaded },
          });
        } else {
          notify.error(response.message || 'Failed to upload icon. Please try again.');
        }
      })
      .catch((err) => {
        notify.error(err?.message || 'Failed to upload icon. Please try again.');
      })
      .finally(() => {
        setUploadingIcons((prev) => {
          const next = { ...prev };
          delete next[index];
          return next;
        });
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

      {/* Statistics Style Picker */}
      <div className="px-[30px] pt-[20px]">
        <p className="font-semibold text-[14px] mb-3">Statistics Style</p>
        <div className="grid grid-cols-2 gap-2">
          {STATISTICS_STYLE_OPTIONS.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => setStatisticsStyle(option.value)}
              className={`flex flex-col gap-2 p-2 rounded-lg border-2 transition-colors text-left ${
                statisticsStyle === option.value
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-full h-[50px]">
                <StatisticsStylePreview style={option.value} />
              </div>
              <span className="text-[11px] font-medium text-gray-700 leading-tight">
                {option.label}
              </span>
            </button>
          ))}
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
            {mdaEditData.statistics?.items?.map((statistic, index) => {
              const isUploadingIcon = !!uploadingIcons[index];
              return (
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
                    {statisticsStyle === 'style2' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                        <div className="flex items-center gap-3">
                          <div className="relative w-[48px] h-[48px] rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                            {statistic.icon ? (
                              <img
                                src={statistic.icon}
                                alt=""
                                className="w-full h-full object-contain p-1"
                              />
                            ) : (
                              <Attachment className="text-gray-400" width={18} />
                            )}
                            {isUploadingIcon && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            )}
                          </div>
                          <input
                            type="file"
                            id={`statistic_icon_${index}`}
                            accept="image/*"
                            hidden
                            onChange={(e) => handleIconUpload(index, e.target.files[0])}
                          />
                          <button
                            type="button"
                            disabled={isUploadingIcon}
                            className="text-[13px] font-medium bg-gray-100 text-gray-700 px-3 py-2 rounded-[6px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => document.getElementById(`statistic_icon_${index}`).click()}
                          >
                            {isUploadingIcon ? 'Uploading...' : statistic.icon ? 'Change' : 'Upload'}
                          </button>
                        </div>
                      </div>
                    )}

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
              );
            })}

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
