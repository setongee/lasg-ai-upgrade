import { useState } from 'react';
import { updateAdminData, uploadFile } from '../pages/MDAs/api/admin/content';
import { useEditDataStore } from '../pages/MDAs/stores/editData.store';
import { useThemeStore } from '../pages/MDAs/stores/theme.store';
import { extractImageFiles, updateObjectByPath } from '../utils/imageUtils';
import { notify } from '../utils/toast';

export const usePublishChanges = () => {
  const [isPublishing, setIsPublishing] = useState(false);
  const { mdaEditData } = useEditDataStore();
  const mda = useThemeStore((state) => state.mda);
  const mdaData = useThemeStore((state) => state.mdaData);

  const publishChanges = async () => {
    if (isPublishing) return false;

    setIsPublishing(true);
    let updatedData = JSON.parse(JSON.stringify(mdaEditData)); // Deep clone
    let loadingToastId = null;

    try {
      // 1. Extract all image files that need to be uploaded
      const imageFiles = extractImageFiles(updatedData);

      // 2. Upload each image and update the data with the returned URLs
      for (const { path, file } of imageFiles) {
        try {
          const response = await uploadFile(file);
          if (response?.url) {
            updatedData = updateObjectByPath(updatedData, path, response.url);
          }
        } catch (error) {
          error;
          // Continue with other uploads even if one fails
        }
      }

      // 3. Save the updated data to the database
      loadingToastId = notify.loading('Saving changes...');
      const result = await updateAdminData(
        mdaData._id,
        {
          landingPage: updatedData, // Make sure we're saving the full landing page data
        },
        'updated the website content'
      );

      // Dismiss the loading notification
      if (loadingToastId) {
        notify.dismiss(loadingToastId);
      }

      if (result) {
        notify.success('Changes published successfully!');
        return true;
      }
      return false;
    } catch (error) {
      // Dismiss the loading notification if it exists
      if (loadingToastId) {
        notify.dismiss(loadingToastId);
      }
      notify.error('Failed to publish changes. Please try again.');
      return false;
    } finally {
      setIsPublishing(false);
    }
  };

  return { publishChanges, isPublishing };
};
