import axios from 'axios';
import { env } from '../../../../api/read/environment';
import { notify } from '../../../../utils/toast';
import { authenticateToken } from '../auth/auth';
import { addLoggingData } from '../logger/logger';

const base_url = `${env}`;

const auth = JSON.parse(window.localStorage.getItem('MDA__TOKEN'));
const page = window.location.pathname.split('/')[3];

export const createRequestTemplate = async (data) => {
  data;
  if (!auth || !auth.token) {
    notify.error('You are not authorized to access this page');
    window.location.href = `/${page}/admin/${page}`;
    return;
  }

  const authResponse = await authenticateToken(auth.token, data.name);

  if (authResponse.status === 'bad') {
    notify.error(authResponse.message);
    window.location.href = `/${data.mda}/admin/${page}`;
    return authResponse;
  }

  const response = await axios.post(`${base_url}/web-template-requests`, data);

  if (response.status === 201) {
    notify.success(response.data.message);
    addLoggingData({
      initiator: auth?.firstname + ' ' + auth?.lastname,
      mda: data.mda,
      activity: `${auth?.firstname + ' ' + auth?.lastname} created a web template request`,
    });
    return response.data;
  } else {
    notify.error(response.data.message);
    return null;
  }
};
