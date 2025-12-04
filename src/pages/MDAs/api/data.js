import axios from 'axios';
import { env } from '../../../api/read/environment';

const base_url = `${env}/directory`;

const getMda = async (id) => {
  const response = await axios.get(`${base_url}/${id}`);

  if (response.status === 200) {
    return response.data;
  }

  return [];
};

export { getMda };
