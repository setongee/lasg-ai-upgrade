import axios from 'axios';
import { env } from '../../../../api/read/environment';

const base_url = `${env}/documents`;

// Compress image before upload
const compressImage = (file, maxWidth = 2560, maxHeight = 1440, quality = 0.9) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };

    img.src = URL.createObjectURL(file);
  });
};

export const uploadDocument = async (file, folderName) => {
  let processedFile = file;

  // Compress if it's an image larger than 1MB (more aggressive)
  if (file.type.startsWith('image/') && file.size > 1 * 1024 * 1024) {
    try {
      processedFile = await compressImage(file);
      console.log(
        `Compressed image from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(processedFile.size / 1024 / 1024).toFixed(2)}MB`
      );

      // If still too large, compress more aggressively
      if (processedFile.size > 5 * 1024 * 1024) {
        processedFile = await compressImage(file, 1920, 1080, 0.7);
        console.log(`Further compressed to ${(processedFile.size / 1024 / 1024).toFixed(2)}MB`);
      }
    } catch (error) {
      console.warn('Image compression failed, uploading original:', error);
    }
  }

  const formData = new FormData();
  formData.append('document', processedFile);
  formData.append('folder', folderName || 'LASG General Uploads');

  try {
    const response = await axios.post(`${base_url}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      maxContentLength: 50 * 1024 * 1024, // 50MB limit
      maxBodyLength: 50 * 1024 * 1024, // 50MB limit
    });

    return response.data;
  } catch (error) {
    console.error('Upload failed:', error.response?.data || error.message);
    throw error;
  }
};
