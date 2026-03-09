import { ComputerIcon, Tablet01Icon, Tablet02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Check, CloudUpload, Edit, Eye, NavArrowDown, Plus, RefreshDouble } from 'iconoir-react';
import { useEffect, useRef, useState } from 'react';
import { usePublishChanges } from '../../../../../../../hooks/usePublishChanges';
import { formatDate } from '../../../../../../../middleware/middleware';
import { notify } from '../../../../../../../utils/toast';
import { createDraft, getSingleDraft, updateDraft } from '../../../../../api/admin/drafts';
import {
  getPublishBucketsByDraftId,
  publishPage,
  updatePublishDraftRequest,
} from '../../../../../api/admin/publish';
import { useEditDataStore } from '../../../../../stores/editData.store';
import { useEditModeStore } from '../../../../../stores/editMode.store';
import { useThemeStore } from '../../../../../stores/theme.store';
import ThemeSelector from '../../../../../Themes/ThemeSelector';
import ConfirmModal from '../../../../confirmModal/confirm-modal';
import AdminChatbot from '../../../components/chatbot/AdminChatbot';
import TemplateContainer from '../templates-container/TemplateContainer';
import CommissionerZoneEdit from './componentEditModal/CommissionerZoneEdit';
import CoreInformationEdit from './componentEditModal/CoreInformationEdit';
import HeroSectionEdit from './componentEditModal/HeroSectionEdit';
import QuickDocumentsEdit from './componentEditModal/QuickDocumentsEdit';
import QuickServicesEdit from './componentEditModal/QuickServicesEdit';
import ResourceCategoriesEdit from './componentEditModal/ResourceCategoriesEdit';
import ServicesEdit from './componentEditModal/ServicesEdit';
import StatisticsEdit from './componentEditModal/StatisticsEdit';
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
  const [publishNotes, setPublishNotes] = useState('');
  const [draftList, setDraftList] = useState([]);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const autoSaveIntervalRef = useRef(null);

  // edit mode
  const setEditViewMode = useEditModeStore((state) => state.setEditViewMode);

  // edit data logic
  const setMdaEditData = useEditDataStore((state) => state.setMdaEditData);
  const mdaEditData = useEditDataStore((state) => state.mdaEditData);
  const {
    setActiveDraftId,
    activeDraftId,
    setOriginalData,
    originalData,
    currentMda,
    setCurrentMda,
    clearEditData,
  } = useEditDataStore();

  // store draft publishing status here;
  const [isDraftPublishCreated, setIsDraftPublishCreated] = useState(null);
  const [publishId, setPublishId] = useState('');

  // Check if MDA has changed and clear edit data if needed
  useEffect(() => {
    if (mda_data?.slug && currentMda && mda_data.slug !== currentMda) {
      // MDA has changed, clear the edit data
      clearEditData();
      setIsDraftPublishCreated(null);
      setPublishId('');
    }

    // Set current MDA if not set or if it's different
    if (mda_data?.slug && mda_data.slug !== currentMda) {
      setCurrentMda(mda_data.slug);
    }
  }, [mda_data?.slug, currentMda, clearEditData, setCurrentMda]);

  useEffect(() => {
    if (activeDraftId) {
      // check if draft is published
      // if published, set isDraftPublishCreated to true
      // if not published, set isDraftPublishCreated to false
      getPublishBucketsByDraftId(activeDraftId).then((response) => {
        if (response?.data) {
          setIsDraftPublishCreated(response.data.status);
          setPublishId(response.data._id);
        } else {
          setIsDraftPublishCreated(null);
        }
      });
    }
  }, [activeDraftId]);

  const createNewDraft = async (title) => {
    const response = await createDraft({
      title: title || 'Untitled Draft',
      data: mdaEditData,
      mda: mda_data.slug,
    });
    if (response.data) {
      // Set the active draft ID
      setActiveDraftId(response.data._id);
      // Set the edit data to the draft data
      setMdaEditData(response.data);
      setOriginalData(response.data);
    }
  };

  const saveDraft = async (data) => {
    if (!activeDraftId || !mdaEditData) return;

    setIsAutoSaving(true);

    try {
      const response = await updateDraft(
        activeDraftId,
        data
          ? { data }
          : {
              data: mdaEditData,
              mda: mda_data.slug,
            }
      );

      // Check if updateDraft failed specifically with a 404 (document not found/deleted)
      if (response === null || response?.status === 404 || response?.response?.status === 404) {
        console.warn('Draft not found, likely deleted. Creating a new one...');
        await createNewDraft('Auto-recovered Draft');
        return;
      }

      setLastSavedAt(new Date());
      setOriginalData(data ? data : mdaEditData);
    } catch (error) {
      console.error('Auto-save failed:', error);
      // Fallback check for 404 in the error object itself if updateDraft throws
      if (error?.response?.status === 404) {
        await createNewDraft('Auto-recovered Draft');
      }
    } finally {
      setIsAutoSaving(false);
    }
  };

  // reset data to last published
  const resetToOriginal = async () => {
    if (!mda_data?.landingPage) return;
    const lastPublished = mda_data.landingPage;
    setMdaEditData(lastPublished);
    await saveDraft(lastPublished);
    notify.success('Reset to original and saved!');
  };

  // Update MDA Edit Data via Admin AI
  const handleContentGenerated = (content) => {
    const objectKey = contentKey[selectedComponent] || '';
    const updatedData = {
      ...mdaEditData,
      ...(objectKey ? { [objectKey]: { ...mdaEditData[objectKey], ...content } } : content),
    };
    setMdaEditData(updatedData);
  };

  const isInitializingRef = useRef(false);

  useEffect(() => {
    const initializeDraft = async () => {
      // Prevent double initialization if already in progress or if mda_data isn't ready
      if (isInitializingRef.current || !mda_data?.slug) return;

      isInitializingRef.current = true;

      try {
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
          }
        } else {
          // Load existing draft data
          const response = await getSingleDraft(activeDraftId);
          if (response && response?.data) {
            setMdaEditData(response.data);
            setOriginalData(response.data);
          } else {
            // create new draft
            const response = await createDraft({
              title: `${mda_data.fullname} - Ready Initial Draft`,
              data: mda_data?.landingPage || {},
              mda: mda_data.slug,
            });

            if (response.data) {
              // Set the active draft ID
              setActiveDraftId(response.data._id);
              // Set the edit data to the draft data
              setMdaEditData(response.data);
              setOriginalData(response.data);
            }
          }
        }
      } catch (error) {
        console.error('Initialization failed:', error);
      } finally {
        isInitializingRef.current = false;
      }
    };

    initializeDraft();
  }, [mda_data?.slug, activeDraftId]);

  // Auto-save effect
  useEffect(() => {
    // Set up auto-save interval only if there's an active draft AND we're in edit mode
    if (activeDraftId && viewMode === 'edit') {
      autoSaveIntervalRef.current = setInterval(() => {
        const isChanged = JSON.stringify(originalData) === JSON.stringify(mdaEditData);
        if (!isChanged) {
          saveDraft();
        }
      }, 3000);
    }

    // Cleanup interval on component unmount or when dependencies change
    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [activeDraftId, mdaEditData, viewMode, originalData, setOriginalData, setMdaEditData]);

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

    if (isDraftPublishCreated && publishId !== '') {
      await updatePublishDraftRequest(publishId, {
        draftId: activeDraftId,
        mda: mda_data?.slug,
        notes: publishNotes,
      });
    } else {
      await publishPage({
        draftId: activeDraftId,
        mda: mda_data?.slug,
        notes: publishNotes,
      });
    }

    setPublishNotes('');
  };

  const [isOriginalChanged, setIsOriginalChanged] = useState(false);

  useEffect(() => {
    if (!mda_data?.landingPage || !mdaEditData) return;
    // Check if current edit data differs from the original live landing page
    const changed = JSON.stringify(mda_data.landingPage) !== JSON.stringify(mdaEditData);
    setIsOriginalChanged(changed);
  }, [mdaEditData, mda_data?.landingPage]);

  const showComponentEdit = () => {
    switch (selectedComponent) {
      case 'heroSection':
        return <HeroSectionEdit />;
      case 'coreInformation':
        return <CoreInformationEdit saveDraft={saveDraft} />;
      case 'quickServices':
        return <QuickServicesEdit />;
      case 'commissionerZone':
        return <CommissionerZoneEdit />;
      case 'youtubePlayer':
        return <YoutubePlayerEdit />;
      case 'services':
        return <ServicesEdit />;
      case 'quickDocuments':
        return <QuickDocumentsEdit />;
      case 'resourceCategories':
        return <ResourceCategoriesEdit />;
      case 'statistics':
        return <StatisticsEdit />;
      default:
        return null;
    }
  };

  const renderDraftStatusMessage = () => {
    if (!isDraftPublishCreated) return null;

    if (isDraftPublishCreated === 'pending') {
      return (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-md mb-4 w-full text-center text-[15px] -mt-[14px] font-medium">
          This draft is awaiting content approval at the moment, you can still make changes to it.
        </div>
      );
    }

    if (isDraftPublishCreated === 'published') {
      return (
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded-md mb-4 w-full text-center text-[15px] -mt-[14px] font-medium">
          This draft has been approved and is now live.
        </div>
      );
    }

    if (isDraftPublishCreated === 'rejected') {
      return (
        <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-2 rounded-md mb-4 w-full text-center text-[15px] -mt-[14px] font-medium">
          This draft has been rejected. Please make the necessary changes and resubmit.
        </div>
      );
    }

    if (isDraftPublishCreated === 'content approved') {
      return (
        <div className="bg-blue-100 border border-blue-400 text-blue-800 px-4 py-2 rounded-md mb-4 w-full text-center text-[15px] -mt-[14px] font-medium">
          This draft has passed content approval and currently awaiting technical approval
        </div>
      );
    }

    return null;
  };

  return (
    <TemplateContainer>
      <div
        className={`fixed bg-gray-300 w-[calc(100%-280px)] left-[280px] top-[145px] flex items-center px-[30px] py-[30px] ${
          viewMode === 'edit' ? 'justify-end' : 'justify-center flex-col'
        }`}
      >
        <div className="titleAdmin z-500 flex items-center justify-between w-full h-[65px] px-6 border-b border-gray-200">
          <div className="flex gap-3">
            <div
              className="px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md hover:bg-gray-700 focus:outline-none cursor-pointer flex items-center gap-1"
              onClick={() => createNewDraft()}
            >
              <Plus className="ml-[-4px] text-[11px]" />
              New Draft
            </div>

            <div
              className={`px-4 py-2 text-sm font-medium border border-transparent rounded-md focus:outline-none flex items-center gap-2 transition-all ${
                isOriginalChanged
                  ? 'text-gray-700 bg-gray-200 hover:bg-green-700 hover:text-white cursor-pointer'
                  : 'text-gray-400 bg-gray-100 cursor-not-allowed opacity-50'
              }`}
              onClick={() => isOriginalChanged && resetToOriginal()}
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
            <div className="flex items-center gap-2 text-sm text-gray-500 w-[250px] justify-end mr-4">
              {isAutoSaving && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Auto-saving...</span>
                </div>
              )}
              {lastSavedAt && !isAutoSaving && (
                <span className="flex items-center gap-1">
                  <p className="font-medium">Last saved:</p> {formatDate(lastSavedAt)},{' '}
                  {lastSavedAt.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </span>
              )}
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

        {/* draft messages */}
        {/* draft messages */}
        {viewMode === 'preview' && renderDraftStatusMessage()}

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
          onClose={() => {
            setShowPublishConfirm(false);
            setPublishNotes('');
          }}
          onConfirm={handleConfirmPublish}
        >
          <p className="text-gray-700 mb-6">
            Are you sure you want to publish these changes? This will update your live site.
          </p>

          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
            <textarea
              value={publishNotes}
              onChange={(e) => setPublishNotes(e.target.value)}
              placeholder="Add any notes or comments about this publish..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-transparent resize-none text-[15px]"
              rows={3}
            />
          </div>
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
