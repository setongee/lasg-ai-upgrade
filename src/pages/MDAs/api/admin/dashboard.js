import axios from 'axios';
import { env } from '../../../../api/read/environment';

const base_url = env;

export const getDashboardData = async (siteName, period) => {
  const response = await axios.get(
    `${base_url}/analytics/visits?siteName=${siteName}&period=${period}`
  );

  if (response.status === 200) {
    return response.data;
  }
};
