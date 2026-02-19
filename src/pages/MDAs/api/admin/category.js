import axios from 'axios';
const base_url = `${env}/category`;

export const getMultipleServices = async () => {
  const response = await axios.get(`${base_url}/multiple-services`);
  return response.data;
};
