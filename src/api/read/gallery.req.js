import axios from 'axios';
import { env } from './environment';

const base_url = `${env}/gallery`;

export const addAlbum = async (data) => {
  const response = await axios.post(`${base_url}/add`, data);

  if (response.status === 200 || response.status === 201) {
    return response.data;
  } else {
    return { status: 'bad', message: 'Something went wrong!' };
  }
};

export const getAlbumsForMda = async (mda) => {
  const response = await axios.get(`${base_url}/get/all/${mda}`);

  if (response.status === 200) {
    return response.data;
  } else {
    return { status: 'bad', message: 'Something went wrong!' };
  }
};

export const getSingleAlbum = async (id) => {
  const response = await axios.get(`${base_url}/view/${id}`);

  if (response.status === 200) {
    return response.data;
  } else {
    return { status: 'bad', message: 'Something went wrong!' };
  }
};

export const updateAlbum = async (id, data) => {
  const response = await axios.put(`${base_url}/update/${id}`, data);

  if (response.status === 200) {
    return response.data;
  } else {
    return { status: 'bad', message: 'Something went wrong!' };
  }
};

export const deleteAlbum = async (id) => {
  const response = await axios.delete(`${base_url}/delete/${id}`);

  if (response.status === 200) {
    return response.data;
  } else {
    return { status: 'bad', message: 'Something went wrong!' };
  }
};
