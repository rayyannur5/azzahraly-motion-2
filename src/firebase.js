// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVTw07uAnBruFMeS0Lu8G83dz0JTC6BIE",
  authDomain: "azzahraly-motion.firebaseapp.com",
  projectId: "azzahraly-motion",
  storageBucket: "azzahraly-motion.appspot.com",
  messagingSenderId: "1022489106438",
  appId: "1:1022489106438:web:fabd02c229cef840aa4b87",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };
