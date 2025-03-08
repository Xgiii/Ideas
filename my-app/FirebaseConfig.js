// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6r_XdhgrVUcuzmDEDUdxin53xE8M4LUA",
  authDomain: "ideas-dcb1f.firebaseapp.com",
  projectId: "ideas-dcb1f",
  storageBucket: "ideas-dcb1f.firebasestorage.app",
  messagingSenderId: "95643064068",
  appId: "1:95643064068:web:cbec1ae4e9e5b5cf272251",
  measurementId: "G-S8J4F6CDMR",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage),
});
// const analytics = getAnalytics(app);
