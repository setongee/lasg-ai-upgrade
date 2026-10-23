import axios from 'axios';
import { env } from '../../../../api/read/environment';

const base_url = `${env}/learn`;

const getToken = () => {
  try {
    return JSON.parse(window.localStorage.getItem('MDA__TOKEN'))?.token;
  } catch {
    return null;
  }
};

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const request = async (method, url, data) => {
  try {
    const response = await axios({ method, url: `${base_url}${url}`, data, headers: authHeaders() });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Returns the published course (with the viewer's progress) or null
export const getLearn = async () => (await request('get', '')).data;

export const saveProgress = (lessonId, position, ended = false) =>
  request('put', `/progress/${lessonId}`, { position, ended });

// Used when the tab is closing, where a normal request would be cancelled
export const saveProgressOnExit = (lessonId, position) => {
  const token = getToken();
  if (!token) return;
  fetch(`${base_url}/progress/${lessonId}`, {
    method: 'PUT',
    keepalive: true,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ position }),
  }).catch(() => {});
};

export const askAboutLesson = async (lessonId, question, history) =>
  (await request('post', `/lessons/${lessonId}/ask`, { question, history })).answer;
