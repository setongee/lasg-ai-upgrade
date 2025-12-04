// import axios from 'axios';
// import { useEffect } from 'react';
// import { v4 as uuidv4 } from 'uuid';
// import { env } from '../api/read/environment';

// const API_URL = env;

// const getSessionId = () => {
//   let sessionId = sessionStorage.getItem('sessionId');
//   if (!sessionId) {
//     sessionId = uuidv4();
//     sessionStorage.setItem('sessionId', sessionId);
//   }
//   return sessionId;
// };

// const getUserId = () => {
//   let userId = localStorage.getItem('userId');
//   if (!userId) {
//     userId = uuidv4();
//     localStorage.setItem('userId', userId);
//   }
//   return userId;
// };

// const parseUserAgent = () => {
//   const ua = navigator.userAgent;
//   return {
//     browser: (() => {
//       if (ua.includes('Firefox')) return 'Firefox';
//       if (ua.includes('Chrome')) return 'Chrome';
//       if (ua.includes('Safari')) return 'Safari';
//       if (ua.includes('Edge')) return 'Edge';
//       return 'Other';
//     })(),
//     device: /Mobile|Android|iPhone|iPad/.test(ua) ? 'Mobile' : 'Desktop',
//     os: (() => {
//       if (ua.includes('Windows')) return 'Windows';
//       if (ua.includes('Mac')) return 'Mac';
//       if (ua.includes('Linux')) return 'Linux';
//       if (ua.includes('Android')) return 'Android';
//       if (ua.includes('iOS')) return 'iOS';
//       return 'Other';
//     })(),
//   };
// };

// const logVisit = async (siteName, page) => {
//   if (!siteName) {
//     console.error('siteName is required for visit tracking');
//     return;
//   }

//   try {
//     const userInfo = parseUserAgent();
//     let data = {
//       siteName,
//       userId: getUserId(),
//       sessionId: getSessionId(),
//       page,
//       referrer: document.referrer,
//       ...userInfo,
//     };

//     await axios.post(`${API_URL}/analytics/log`, data);
//   } catch (error) {
//     console.error('Error logging visit:', error);
//   }
// };

// export const useVisitTracker = (siteName, pageName) => {
//   useEffect(() => {
//     if (siteName) {
//       pageName !== 'admin' && logVisit(siteName, `/${pageName}`);
//     }
//   }, [siteName, pageName]);
// };

import axios from 'axios';
import { useEffect, useRef } from 'react';
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
  const ua = navigator.userAgent;
  return {
    browser: (() => {
      if (ua.includes('Firefox')) return 'Firefox';
      if (ua.includes('Chrome')) return 'Chrome';
      if (ua.includes('Safari')) return 'Safari';
      if (ua.includes('Edge')) return 'Edge';
      return 'Other';
    })(),
    device: /Mobile|Android|iPhone|iPad/.test(ua) ? 'Mobile' : 'Desktop',
    os: (() => {
      if (ua.includes('Windows')) return 'Windows';
      if (ua.includes('Mac')) return 'Mac';
      if (ua.includes('Linux')) return 'Linux';
      if (ua.includes('Android')) return 'Android';
      if (ua.includes('iOS')) return 'iOS';
      return 'Other';
    })(),
  };
};

const logVisit = async (siteName, page) => {
  if (!siteName) {
    console.error('siteName is required for visit tracking');
    return;
  }

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
