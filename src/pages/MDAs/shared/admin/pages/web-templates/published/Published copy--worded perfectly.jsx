import { ComputerIcon, Tablet01Icon, Tablet02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Check, CloudUpload, Edit, Eye, NavArrowDown, Plus, RefreshDouble } from 'iconoir-react';
import { useEffect, useRef, useState } from 'react';
import { usePublishChanges } from '../../../../../../../hooks/usePublishChanges';
import { formatDate3 } from '../../../../../../../middleware/middleware';
import { notify } from '../../../../../../../utils/toast';
import { createDraft, getSingleDraft, updateDraft } from '../../../../../api/admin/drafts';
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
  const [draftList, setDraftList] = useState([]);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const autoSaveIntervalRef = useRef(null);

  // edit mode
  const setEditViewMode = useEditModeStore((state) => state.setEditViewMode);

  // edit data logic
  const setMdaEditData = useEditDataStore((state) => state.setMdaEditData);
  const mdaEditData = useEditDataStore((state) => state.mdaEditData);
  const { setActiveDraftId, activeDraftId, setOriginalData, isDirty } = useEditDataStore();

  const createNewDraft = async (title) => {
    await createDraft({
      title: title || 'Untitled Draft',
      data: mdaEditData,
      mda: mda_data.slug,
    })
      .then((response) => {
        if (response.data) {
          notify.success('New draft created successfully!');
        }
      })
      .catch((error) => {
        notify.error('Failed to create draft');
      });
  };

  const saveDraft = async () => {
    if (!activeDraftId || !mdaEditData) return;

    setIsAutoSaving(true);

    try {
      await updateDraft(activeDraftId, {
        title: `${mda_data.fullname} - Draft`,
        data: mdaEditData,
        mda: mda_data.slug,
      });

      setLastSavedAt(new Date());
      ('Draft auto-saved successfully');
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsAutoSaving(false);
    }
  };

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
    const initializeDraft = async () => {
      // Check if there's no active draft
      if (!activeDraftId) {
        // Create a new draft with the current MDA data
        const response = await createDraft({
          title: `${mda_data.fullname} - Initial Draft`,
          data: mda_data?.landingPage || {},
          mda: mda_data.slug,
        });

        if (response.data) {
          // Set the active draft ID
          setActiveDraftId(response.data._id);
          // Set the edit data to the draft data
          setMdaEditData(response.data);
          setOriginalData(response.data);
          notify.success('Initial draft created successfully!');
        }
      } else {
        // Load existing draft data
        const response = await getSingleDraft(activeDraftId);
        response.data;
        if (response.data) {
          setMdaEditData(response.data);
          setOriginalData(response.data);
        } else {
          setMdaEditData(mda_data?.landingPage || {});
          setOriginalData(mda_data?.landingPage || {});
        }
      }
    };

    initializeDraft();
  }, [mda_data, activeDraftId]);

  // Auto-save effect
  useEffect(() => {
    // Set up auto-save interval only if there's an active draft AND we're in edit mode
    if (activeDraftId && viewMode === 'edit' && isDirty) {
      autoSaveIntervalRef.current = setInterval(() => {
        saveDraft();
      }, 5000); // 10 seconds
    }

    // Cleanup interval on component unmount or when dependencies change
    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [activeDraftId, mdaEditData, viewMode]);

  mdaEditData;

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
          <div className="flex gap-3">
            <div
              className="px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md hover:bg-gray-700 focus:outline-none cursor-pointer flex items-center gap-1"
              onClick={() => createNewDraft()}
            >
              <Plus className="ml-[-4px] text-[11px]" />
              New Draft
            </div>

            <div
              className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-200 border border-transparent rounded-md hover:bg-green-700 focus:outline-none cursor-pointer flex items-center gap-2"
              onClick={() => createNewDraft()}
            >
              <RefreshDouble className="ml-[-4px] text-[10px]" />
              Reset to Original
            </div>
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
            {/* Auto-save status indicator */}
            <div className="flex items-center gap-2 text-sm text-gray-500 w-[200px] justify-end mr-4">
              {isAutoSaving && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Auto-saving...</span>
                </div>
              )}
              {lastSavedAt && !isAutoSaving && <span>Last saved: {formatDate3(lastSavedAt)}</span>}
            </div>

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

        {/* ////////////////////////////////////////////// */}

        {/* Ui Builder Starts here */}

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
