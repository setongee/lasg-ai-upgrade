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

export const refreshToken = async (token, mda) => {
  const response = await axios.post(`${base_url}/mda/refresh-token`, { token, mda });

  if (response.status === 200) {
    return response.data;
  } else {
    return { status: 'bad', message: 'Missing Token' };
  }
};

export const requestOtp = async (email) => {
  const response = await axios.post(`${base_url}/mda/forgot-password`, { email });

  if (response.status === 200) {
    return response.data;
  } else {
    return { status: 'bad', message: 'Something went wrong!' };
  }
};

export const verifyOtp = async (email, otp) => {
  const response = await axios.post(`${base_url}/mda/verify-otp`, { email, otp });

  if (response.status === 200) {
    return response.data;
  } else {
    return { status: 'bad', message: 'Something went wrong!' };
  }
};

export const changePassword = async (id, password, newPassword) => {
  const response = await axios.post(`${base_url}/mda/user/auth/password/${id}`, {
    password,
    newPassword,
  });

  if (response.status === 200) {
    return response.data;
  } else {
    return { status: 'bad', message: 'Something went wrong!' };
  }
};
