import axios from 'axios';
import { env } from '../../../../api/read/environment';

const base_url = `${env}`;

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${base_url}/mda/login`, {
      email,
      password,
      date: new Date().toLocaleString(),
    });

    return response.data;
  } catch (error) {
    return { status: 'bad', message: 'Login failed' };
  }
};

export const authenticateToken = async (token) => {
  try {
    const response = await axios.post(`${base_url}/mda/login/authenticate`, {
      token,
    });

    return response.data;
  } catch (error) {
    return { status: 'bad', message: 'Token verification failed' };
  }
};

export const refreshToken = async (token, mda) => {
  try {
    const response = await axios.post(`${base_url}/mda/refresh-token`, {
      token,
      mda,
    });

    return response.data;
  } catch (error) {
    return { status: 'bad', message: 'Token refresh failed' };
  }
};
