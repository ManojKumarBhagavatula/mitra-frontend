// src/firebase.js
// Replace all values below with your Firebase project config
// Firebase Console → Project Settings → Your Apps → Web App → SDK setup

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6--RRY_I_Z4jzSyulgt2zbxsGsVZld5Q",
  authDomain: "mitra-chatbot-3555c.firebaseapp.com",
  projectId: "mitra-chatbot-3555c",
  storageBucket: "mitra-chatbot-3555c.firebasestorage.app",
  messagingSenderId: "200738017888",
  appId: "1:200738017888:web:5910d3d81c6041726ae905",
  measurementId: "G-99VJXND3P8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
