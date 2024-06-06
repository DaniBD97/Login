// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "auth-e89f3.firebaseapp.com",
  projectId: "auth-e89f3",
  storageBucket: "auth-e89f3.appspot.com",
  messagingSenderId: "655330745093",
  appId: "1:655330745093:web:62e24db21b8df6827af56c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);