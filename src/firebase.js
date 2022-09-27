// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { GoogleAuthProvider } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "_____Api-key_____",
  authDomain: "_____Auth-Domain_____",
  projectId: "_____Project-Id_____",
  storageBucket: "_____Storeage-Bucket_____",
  messagingSenderId: "_____Messageing-Sendard-Id_____",
  appId: "_____App-Id_____",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
