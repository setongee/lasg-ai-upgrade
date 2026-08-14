import axios from 'axios';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../../../api/firebase/config';
import { env } from '../../../../api/read/environment';
import { notify } from '../../../../utils/toast';
import { authenticateToken } from '../auth/auth';
import { addLoggingData } from '../logger/logger';

const base_url = `${env}/directory`;

const auth = JSON.parse(window.localStorage.getItem('MDA__TOKEN'));
const page = window.location.pathname.split('/')[3];
const mda = window.location.pathname.split('/')[1];

export const updateAdminData = async (id, data, activity) => {
  if (!auth || !auth.token) {
    notify.error('You are not authorized to access this page');
    window.location.href = `/${mda}/admin/${page}`;
    return;
  }

  const authResponse = await authenticateToken(auth.token, data.name);

  if (authResponse.status === 'bad') {
    notify.error(authResponse.message);
    window.location.href = `/${auth?.mda}/admin/${page}`;
    return authResponse;
  }

  const response = await axios.put(`${base_url}/update/${id}`, data);

  if (response.status === 200) {
    notify.success(response.data.message);
    addLoggingData({
      initiator: auth?.firstname + ' ' + auth?.lastname,
      mda: data.name || auth?.mda,
      activity: `${auth?.firstname + ' ' + auth?.lastname} ${activity || 'made some changes'}`,
    });
    return response.data;
  } else {
    notify.error(response.data.message);
    return [];
  }
};

export const createRequestTemplate = async (data) => {
  if (!auth || !auth.token) {
    notify.error('You are not authorized to access this page');
    window.location.href = `/${mda}/admin/${page}`;
    return;
  }

  const authResponse = await authenticateToken(auth.token, data.name);

  if (authResponse.status === 'bad') {
    notify.error(authResponse.message);
    window.location.href = `/${auth?.mda}/admin/${page}`;
    return authResponse;
  }

  const response = await axios.post(`${base_url}/web-template-requests`, data);

  if (response.status === 200) {
    notify.success(response.data.message);
    addLoggingData({
      initiator: auth?.firstname + ' ' + auth?.lastname,
      mda: data.mda || auth?.mda,
      activity: `${auth?.firstname + ' ' + auth?.lastname} created a web template request for ${
        data.mda || auth?.mda
      }`,
    });
    return response.data;
  } else {
    notify.error(response.data.message);
    return [];
  }
};

export const uploadFile = async (data) => {
  if (!auth || !auth.token) {
    notify.error('You are not authorized to access this page');
    window.location.href = `/${mda}/admin/${page}`;
    return;
  }

  const authResponse = await authenticateToken(auth.token, data.name);

  if (authResponse.status === 'bad') {
    notify.error(authResponse.message);
    window.location.href = `/${auth?.mda}/admin/${page}`;
    return authResponse;
  }

  const response = await axios.post(`${base_url}/upload`, data);

  if (response.status === 200) {
    addLoggingData({
      initiator: auth?.firstname + ' ' + auth?.lastname,
      mda: auth?.mda,
      activity: `${auth?.firstname + ' ' + auth?.lastname} uploaded a file`,
    });
    return response.data;
  } else {
    notify.error(response.data.message);
    return [];
  }
};

// Direct browser-to-Cloudinary upload — avoids sending large base64 payloads
// through our own server (and whatever body-size limits sit in front of it).
export const getUploadSignature = async (publicId) => {
  if (!auth || !auth.token) {
    notify.error('You are not authorized to access this page');
    window.location.href = `/${mda}/admin/${page}`;
    return;
  }

  const authResponse = await authenticateToken(auth.token);

  if (authResponse.status === 'bad') {
    notify.error(authResponse.message);
    window.location.href = `/${auth?.mda}/admin/${page}`;
    return authResponse;
  }

  const response = await axios.post(`${base_url}/upload-signature`, { public_id: publicId });
  return response.data;
};

export const uploadFileDirect = async (file, publicId) => {
  const signatureData = await getUploadSignature(publicId);

  if (!signatureData || signatureData.status !== 'ok') {
    return { status: 'bad', message: signatureData?.message || 'Could not authorize upload' };
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', signatureData.api_key);
  formData.append('timestamp', signatureData.timestamp);
  formData.append('signature', signatureData.signature);
  formData.append('public_id', signatureData.public_id);
  formData.append('overwrite', 'true');

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${signatureData.cloud_name}/image/upload`,
      formData
    );

    addLoggingData({
      initiator: auth?.firstname + ' ' + auth?.lastname,
      mda: auth?.mda,
      activity: `${auth?.firstname + ' ' + auth?.lastname} uploaded a file`,
    });

    return { status: 'ok', url: response.data.secure_url };
  } catch (error) {
    return {
      status: 'bad',
      message: error?.response?.data?.error?.message || error.message,
    };
  }
};

export const uploadDocument = async (file, name) => {
  if (!auth || !auth.token) {
    notify.error('You are not authorized to access this page');
    window.location.href = `/${mda}/admin/${page}`;
    return;
  }

  const authResponse = await authenticateToken(auth.token, name);

  if (authResponse.status === 'bad') {
    notify.error("Oops! Something went wrong, File couldn't be uploaded");
    window.location.href = `/${auth?.mda}/admin/${page}`;
    return authResponse;
  }

  const storageRef = ref(storage, `uploads/moh/${name}`);

  // 'file' comes from the Blob or File API
  const download = await uploadBytes(storageRef, file).then((snapshot) => {
    const result = getDownloadURL(storageRef).then((url) => url);
    return result;
  });

  notify.success('File uploaded successfully');
  addLoggingData({
    initiator: auth?.firstname + ' ' + auth?.lastname,
    mda: auth?.mda,
    activity: `${auth?.firstname + ' ' + auth?.lastname} uploaded a document - ${name}`,
  });

  return download;
};
