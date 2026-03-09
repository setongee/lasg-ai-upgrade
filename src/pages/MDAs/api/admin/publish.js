import axios from 'axios';
import { env } from '../../../../api/read/environment';
import { notify } from '../../../../utils/toast';
import { authenticateToken } from '../auth/auth';
import { addLoggingData } from '../logger/logger';

const base_url = `${env}/publish-bucket`;

const auth = JSON.parse(window.localStorage.getItem('MDA__TOKEN'));
const page = window.location.pathname.split('/')[3];

export const publishPage = async (data) => {
  console.log(data);
  if (!auth || !auth.token) {
    notify.error('You are not authorized to access this page');
    window.location.href = `/${data.mda}/admin/${page}`;
    return;
  }

  const authResponse = await authenticateToken(auth.token, data.name);

  if (authResponse.status === 'bad') {
    notify.error(authResponse.message);
    window.location.href = `/${data.mda}/admin/${page}`;
    return authResponse;
  }

  const response = await axios.post(`${base_url}/create`, data);

  if (response.status === 201) {
    addLoggingData({
      initiator: auth?.firstname + ' ' + auth?.lastname,
      mda: data.mda,
      activity: `${auth?.firstname + ' ' + auth?.lastname} made a publish request`,
    });
    return response.data;
  } else {
    notify.error(response.data.message);
    return null;
  }
};

export const getPublishBucketsByDraftId = async (id) => {
  const response = await axios.get(`${base_url}/view/${id}`);
  if (response.status === 200) {
    return response.data;
  } else {
    notify.error(response.data.message);
    return null;
  }
};

export const updatePublishDraftRequest = async (id, data) => {
  console.log(data);
  const response = await axios.put(`${base_url}/update-data/${id}`, data);

  if (response.status === 200) {
    return response.data;
  } else {
    notify.error(response.data.message);
    return null;
  }
};
