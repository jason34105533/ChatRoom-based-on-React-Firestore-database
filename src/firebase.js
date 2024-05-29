// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDikiSIV4I5GNEOwuBqU6ugCiofqO66zXc",
  authDomain: "ss-cr-2.firebaseapp.com",
  projectId: "ss-cr-2",
  storageBucket: "ss-cr-2.appspot.com",
  messagingSenderId: "167821813257",
  appId: "1:167821813257:web:9c3a6295bb208b8197bad8",
  measurementId: "G-TN0QDNGLDN"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
// const analytics = getAnalytics(app);