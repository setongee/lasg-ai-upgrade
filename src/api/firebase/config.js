// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCEe9GOR7rfDBxW1VM7GSk8ccjJ3V-trZM',
  authDomain: 'lasg-a9f5c.firebaseapp.com',
  projectId: 'lasg-a9f5c',
  storageBucket: 'lasg-a9f5c.appspot.com',
  messagingSenderId: '989404118375',
  appId: '1:989404118375:web:8329fdab770c13fa6583c2',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
