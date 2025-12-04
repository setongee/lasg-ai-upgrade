import axios from 'axios';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../../../api/firebase/config';
import { env } from '../../../../api/read/environment';

const base_url = `${env}/directory`;

export const updateAdminData = async (id, data) => {
  const response = await axios.put(`${base_url}/update/${id}`, data);

  if (response.status === 200) {
    return response.data;
  } else {
    return [];
  }
};

export const uploadFile = async (data) => {
  const response = await axios.post(`${base_url}/upload`, data);

  if (response.status === 200) {
    return response.data;
  } else {
    return [];
  }
};

export const uploadDocument = async (file, name) => {
  const storageRef = ref(storage, `uploads/moh/${name}`);

  // 'file' comes from the Blob or File API
  const download = await uploadBytes(storageRef, file).then((snapshot) => {
    const result = getDownloadURL(storageRef).then((url) => url);
    return result;
  });

  return download;
};
