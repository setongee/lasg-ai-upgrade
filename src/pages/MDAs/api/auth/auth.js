import axios from 'axios';
import { env } from '../../../../api/read/environment';

const base_url = `${env}`;

export const loginUser = async (email, password) => {
  const date = new Date();

  const response = await axios.post(`${base_url}/mda/login`, {
    email,
    password,
    date: date.toLocaleString(),
  });

  if (response.status === 200) {
    return response.data;
  } else {
    return { status: 'bad', message: 'something went wrong!' };
  }
};

export const authenticateToken = async (token) => {
  const response = await axios.post(`${base_url}/mda/login/authenticate`, { token });

  if (response.status === 200) {
    return response.data;
  } else {
    return { status: 'bad', message: 'Missing Token' };
  }
};
