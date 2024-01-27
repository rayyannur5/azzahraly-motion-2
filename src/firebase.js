// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbnvBP2T9ivi4UbBGDKCDdH9Fw-dkZmlE",
  authDomain: "azzahraly-motion-2.firebaseapp.com",
  projectId: "azzahraly-motion-2",
  storageBucket: "azzahraly-motion-2.appspot.com",
  messagingSenderId: "956655974632",
  appId: "1:956655974632:web:733a69718aa2d4e467315d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export {app, storage}