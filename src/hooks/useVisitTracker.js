import axios from 'axios';
import { useEffect, useRef } from 'react';
import { UAParser } from 'ua-parser-js';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../api/read/environment';

const API_URL = env;

const getSessionId = () => {
  let sessionId = sessionStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

const getUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem('userId', userId);
  }
  return userId;
};

const parseUserAgent = () => {
  const { browser, os, device } = new UAParser().getResult();

  return {
    browser: browser.name || 'Other',
    os: os.name || 'Other',
    device: device.type === 'mobile' || device.type === 'tablet' ? 'Mobile' : 'Desktop',
  };
};

const logVisit = async (siteName, page) => {
  if (!siteName) {
    console.error('siteName is required for visit tracking');
    return;
  }

  // Automated/headless browsers (Selenium, Puppeteer, Playwright) set this
  // flag — real user browsers never do. Skip logging entirely rather than
  // relying on the server to catch it, since we already know it's not one.
  if (navigator.webdriver) return;

  try {
    const userInfo = parseUserAgent();
    const data = {
      siteName,
      userId: getUserId(),
      sessionId: getSessionId(),
      page,
      referrer: document.referrer,
      ...userInfo,
    };

    await axios.post(`${API_URL}/analytics/log`, data);
  } catch (error) {
    console.error('Error logging visit:', error);
  }
};

export const useVisitTracker = (siteName, pageName) => {
  const lastTracked = useRef(null);

  useEffect(() => {
    if (!siteName || pageName === 'admin') return;

    const currentPage = `/${pageName || 'home'}`;
    if (lastTracked.current !== currentPage) {
      lastTracked.current = currentPage;
      logVisit(siteName, currentPage);
    }
  }, [siteName, pageName]);
};
