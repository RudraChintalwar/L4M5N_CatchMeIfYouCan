// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-B4Qle-SanCsjgdmDmD6uDU_oXxTQn_M",
  authDomain: "smarttodolist-60ceb.firebaseapp.com",
  projectId: "smarttodolist-60ceb",
  storageBucket: "smarttodolist-60ceb.firebasestorage.app",
  messagingSenderId: "369972368399",
  appId: "1:369972368399:web:5bc899d17bf0b9eecbff7a",
  measurementId: "G-R642FWLLZV"
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);