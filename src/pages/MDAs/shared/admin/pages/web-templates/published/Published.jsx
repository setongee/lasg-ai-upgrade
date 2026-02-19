import { ComputerIcon, Tablet01Icon, Tablet02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Check, CloudUpload, Edit, Eye, NavArrowDown, Plus } from 'iconoir-react';
import { useEffect, useState } from 'react';
import { usePublishChanges } from '../../../../../../../hooks/usePublishChanges';
import { notify } from '../../../../../../../utils/toast';
import { useEditDataStore } from '../../../../../stores/editData.store';
import { useEditModeStore } from '../../../../../stores/editMode.store';
import { useThemeStore } from '../../../../../stores/theme.store';
import ThemeSelector from '../../../../../Themes/ThemeSelector';
import ConfirmModal from '../../../../confirmModal/confirm-modal';
import AdminChatbot from '../../../components/chatbot/AdminChatbot';
import TemplateContainer from '../templates-container/TemplateContainer';
import CommissionerZoneEdit from './componentEditModal/CommissionerZoneEdit';
import HeroSectionEdit from './componentEditModal/HeroSectionEdit';
import QuickServicesEdit from './componentEditModal/QuickServicesEdit';
import YoutubePlayerEdit from './componentEditModal/YoutubePlayerEdit';
import { contentKey } from './data_content_key';
import './published.scss';

const Published = () => {
  // const theme = useThemeStore((state) => state.mda);
  const mda_data = useThemeStore((state) => state.mdaData);
  const setDevice = useEditModeStore((state) => state.setDevice);
  const selectedComponent = useEditModeStore((state) => state.selectedComponent);
  const setSelectedComponent = useEditModeStore((state) => state.setSelectedComponent);
  const [deviceSize, setDeviceSize] = useState('desktop');
  const [viewMode, setViewMode] = useState('preview');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const setEditViewMode = useEditModeStore((state) => state.setEditViewMode);
  const setMdaEditData = useEditDataStore((state) => state.setMdaEditData);
  const mdaEditData = useEditDataStore((state) => state.mdaEditData);
  const draftId = useEditDataStore((state) => state.currentDraftId);
  const { getDraftList, createNewDraft } = useEditDataStore();
  const draftList = getDraftList();

  // Update MDA Edit Data via AI
  const handleContentGenerated = (content) => {
    const objectKey = contentKey[selectedComponent] || '';
    const updatedData = {
      ...mdaEditData,
      ...(objectKey ? { [objectKey]: { ...mdaEditData[objectKey], ...content } } : content),
    };
    setMdaEditData(updatedData);
  };

  useEffect(() => {
    // Only run this effect if we have the mda_data loaded
    if (!mda_data?.landingPage) return;

    // If there are no drafts and no current draft ID, initialize with default data
    if (draftList.length === 0 && !draftId) {
      // Only update if the current mdaEditData is different from the default
      if (JSON.stringify(mdaEditData) !== JSON.stringify(mda_data.landingPage)) {
        setMdaEditData(mda_data.landingPage);
      }
      return;
    }

    // If we have a draft ID, find and load that draft
    if (draftId) {
      const currentDraft = draftList.find((draft) => draft.id === draftId);
      if (currentDraft) {
        // Only update if the data is different
        if (JSON.stringify(mdaEditData) !== JSON.stringify(currentDraft.data)) {
          setMdaEditData(currentDraft.data);
        }
      } else if (draftList.length > 0) {
        // If draft ID is invalid but we have drafts, load the first one
        if (JSON.stringify(mdaEditData) !== JSON.stringify(draftList[0].data)) {
          setMdaEditData(draftList[0].data);
        }
      } else {
        // Fallback to default data if no valid drafts found
        if (JSON.stringify(mdaEditData) !== JSON.stringify(mda_data.landingPage)) {
          setMdaEditData(mda_data.landingPage);
        }
      }
    } else {
      if (JSON.stringify(mdaEditData) !== JSON.stringify(mda_data.landingPage)) {
        setMdaEditData(mda_data.landingPage);
      }
    }
  }, [mda_data, draftId, draftList, setMdaEditData, mdaEditData]);

  console.log(draftId, mdaEditData);

  useEffect(() => {
    setDevice(deviceSize);
  }, [deviceSize]);

  useEffect(() => {
    setEditViewMode(viewMode);
    if (viewMode === 'preview') {
      setSelectedComponent('');
    }
  }, [viewMode]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const { publishChanges, isPublishing } = usePublishChanges();

  const startDraft = () => {
    createNewDraft();
    notify.success('New draft created successfully!');
  };

  const handlePublish = () => {
    setShowPublishConfirm(true);
  };

  const handleConfirmPublish = async () => {
    setShowPublishConfirm(false);
    const success = await publishChanges();
    if (success) {
      // Optional: Add any post-publish logic here
    }
  };

  const showComponentEdit = () => {
    switch (selectedComponent) {
      case 'heroSection':
        return <HeroSectionEdit />;
      case 'quickServices':
        return <QuickServicesEdit />;
      case 'commissionerZone':
        return <CommissionerZoneEdit />;
      case 'youtubePlayer':
        return <YoutubePlayerEdit />;
      default:
        return null;
    }
  };

  return (
    <TemplateContainer>
      <div
        className={`fixed bg-gray-300 w-[calc(100%-280px)] left-[280px] top-[145px] flex items-center px-[50px] py-[20px] ${
          viewMode === 'edit' ? 'justify-end' : 'justify-center flex-col'
        }`}
      >
        <div className="titleAdmin z-10 flex items-center justify-between w-full h-[65px] px-6 border-b border-gray-200">
          <div
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md hover:bg-green-700 focus:outline-none cursor-pointer flex items-center gap-1"
            onClick={() => startDraft()}
          >
            <Plus /> Create New Draft
          </div>

          {/* Device size controls */}
          <div className="flex items-center gap-2 p-1.5 rounded-lg">
            <button
              className={`h-9 w-9 flex items-center justify-center rounded-md  hover:bg-white transition-all ${
                deviceSize === 'desktop' ? 'bg-[#d8e9e370]' : ''
              }`}
              title="Desktop View"
              onClick={() => setDeviceSize('desktop')}
            >
              <HugeiconsIcon
                icon={ComputerIcon}
                size={19}
                className={`text-gray-400 ${deviceSize === 'desktop' ? 'text-green-700' : ''}`}
                strokeWidth={2}
              />
            </button>
            <button
              className={`h-9 w-9 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all ${
                deviceSize === 'tablet' ? 'bg-[#d8e9e370]' : ''
              }`}
              title="Tablet View"
              onClick={() => setDeviceSize('tablet')}
            >
              <HugeiconsIcon
                icon={Tablet01Icon}
                size={19}
                className={`text-gray-400 ${deviceSize === 'tablet' ? 'text-green-700' : ''}`}
                strokeWidth={2}
              />
            </button>
            <button
              className={`h-9 w-9 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all ${
                deviceSize === 'mobile' ? 'bg-[#d8e9e370]' : ''
              }`}
              title="Mobile View"
              onClick={() => setDeviceSize('mobile')}
            >
              <HugeiconsIcon
                icon={Tablet02Icon}
                size={20}
                className={`text-gray-400 ${deviceSize === 'mobile' ? 'text-green-700' : ''}`}
              />
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none cursor-pointer"
              onClick={toggleDropdown}
            >
              {viewMode === 'preview' ? (
                <div className="flex items-center gap-2">
                  <Eye width={16} height={16} />
                  <span>Preview Mode</span>
                  <NavArrowDown />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Edit width={16} height={16} />
                  <span>Edit Mode</span>
                  <NavArrowDown />
                </div>
              )}

              {/* dropdown */}
              {showDropdown && (
                <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg">
                  <ul className="py-1">
                    <li
                      className={`text-left px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center ${
                        viewMode === 'preview' ? 'font-semibold' : ''
                      }`}
                      onClick={() => setViewMode('preview')}
                    >
                      Preview Mode {viewMode === 'preview' ? <Check width={16} height={16} /> : ''}
                    </li>
                    <li
                      className={`text-left px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center ${
                        viewMode === 'edit' ? 'font-semibold' : ''
                      }`}
                      onClick={() => {
                        setViewMode('edit');
                        setSelectedComponent('heroSection');
                      }}
                    >
                      Edit Mode {viewMode === 'edit' ? <Check width={16} height={16} /> : ''}
                    </li>
                  </ul>
                </div>
              )}
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md flex items-center gap-2 ${
                isPublishing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              <CloudUpload width={16} height={16} />
              {isPublishing ? 'Publishing...' : 'Publish Changes'}
            </button>
          </div>
        </div>

        {/* show edit form selector */}
        {showComponentEdit()}

        {/* show editor canvas */}
        <div
          className={`editor-canvas bg-white overflow-y-scroll h-[calc(100vh-185px)] ${
            deviceSize === 'desktop'
              ? 'w-[100%]'
              : deviceSize === 'tablet'
                ? 'w-[60%]'
                : 'w-[400px]'
          } ${viewMode === 'edit' ? 'w-[calc(100%-350px)]' : ''}`}
        >
          <ThemeSelector theme={mda_data?.theme} isEdit={true} data={mda_data} />
        </div>

        <ConfirmModal
          open={showPublishConfirm}
          onClose={() => setShowPublishConfirm(false)}
          onConfirm={handleConfirmPublish}
        >
          <p className="text-gray-700 mb-4">
            Are you sure you want to publish these changes? This will update your live site.
          </p>
        </ConfirmModal>
      </div>

      {/* admin ai content assistant chatbot */}
      {selectedComponent !== '' && (
        <AdminChatbot
          onContentGenerated={handleContentGenerated}
          context={selectedComponent}
          mdaType={mda_data?.mda}
          vision={mda_data?.vision}
        />
      )}
    </TemplateContainer>
  );
};

export default Published;
