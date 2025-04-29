// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = 
{
  apiKey: "AIzaSyBAz_cM7uIprxsF6q3Ik5L3VVHcGe6EiJI",
  authDomain: "cyberhunt2-bb355.firebaseapp.com",
  projectId: "cyberhunt2-bb355",
  storageBucket: "cyberhunt2-bb355.firebasestorage.app",
  messagingSenderId: "423935190552",
  appId: "1:423935190552:web:067871427e33bd74c9856d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);