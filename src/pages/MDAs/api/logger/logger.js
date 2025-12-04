import { env } from '../../../../api/read/environment';

export const logger = async (data) => {
  const baseUrl = `${env}/logger`;
  await axios.post(baseUrl, data);
};
