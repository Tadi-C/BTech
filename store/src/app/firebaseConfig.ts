// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtqWL4evI5qjbq56CyD8U-tD05zLkxde4",
  authDomain: "bridgelabsstore.firebaseapp.com",
  projectId: "bridgelabsstore",
  storageBucket: "bridgelabsstore.appspot.com",
  messagingSenderId: "963527055713",
  appId: "1:963527055713:web:daa2507cc6346bd9204d20",
  measurementId: "G-PT6S7K342T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
