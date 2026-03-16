import axios from 'axios';
import { env } from '../../../../api/read/environment';

const base_url = `${env}/documents`;

export const uploadDocument = async (file, folderName) => {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('folder', folderName || 'LASG General Uploads');

  try {
    const response = await axios.post(`${base_url}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Upload failed:', error.response?.data || error.message);
    throw error;
  }
};
