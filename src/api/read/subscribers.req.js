import axios from 'axios';
import { env } from './environment';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { notify } from '../../utils/toast';
dayjs.extend(relativeTime);

const base_url = `${env}/subscribers`;

export const getAllSubscribers = async () => {
  const response = await axios.get(`${base_url}/all`);

  if (response.status === 200) {
    if (response.data.data.length) {
      const sortData = response.data.data.sort((a, b) => {
        return a.updatedAt < b.updatedAt ? -1 : a.updatedAt > b.updatedAt ? 1 : 0;
      });

      const howLong = dayjs().to(dayjs(sortData[sortData.length - 1].updatedAt));

      return {
        data: sortData,
        lastUpdated: howLong,
        message: 'Subscribers data has been fetched successfully!',
      };
    } else {
      return {
        data: [],
        lastUpdated: '0 days ago',
        message: 'No subscribers yet!',
      };
    }
  } else {
    return 'Something went wrong!';
  }
};

export const addSubscriber = async (data) => {
  try {
    const response = await axios.post(`${base_url}/subscribe`, data);

    if (response.status === 200) {
      notify.success(response.data.message);
      return {
        success: true,
        message: response.data.message || 'Subscriber added successfully!',
      };
    } else {
      notify.error(response.data.message);
      return {
        success: false,
        message: response.data.message || 'Failed to add subscriber',
      };
    }
  } catch (error) {
    notify.error(error.response?.data?.message || 'Something went wrong!');
    return {
      success: false,
      message: error.response?.data?.message || 'Something went wrong!',
    };
  }
};

export const getSubsciptionsByMda = async (mdaId) => {
  mdaId;
  try {
    const response = await axios.get(`${base_url}/mda/${mdaId}`);
    response;
    return response.data;
  } catch (error) {
    return error.response?.data || 'Something went wrong!';
  }
};

export const deleteSubscriber = async (subscriberId) => {
  try {
    const response = await axios.delete(`${base_url}/delete/${subscriberId}`);
    notify.success(response.data.message || 'Subscriber deleted successfully!');
    return response.data;
  } catch (error) {
    notify.error(error.response?.data?.message || 'Failed to delete subscriber');
    return error.response?.data || 'Something went wrong!';
  }
};
