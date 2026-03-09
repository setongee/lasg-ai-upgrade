import axios from 'axios';
import { env } from '../../../../api/read/environment';

const addLoggingData = async (data) => {
  const baseUrl = `${env}/logger/add`;
  try {
    await axios.post(baseUrl, data);
  } catch (error) {
    error;
  }
};

const getLoggingData = async (id) => {
  const baseUrl = `${env}/logger/get/mda/${id}`;
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    error;
  }
};

export { addLoggingData, getLoggingData };
