// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCj5mO-dkD8PquexitJCnSk4uMKp7uzw64",
  authDomain: "carebot-c77b2.firebaseapp.com",
  projectId: "carebot-c77b2",
  storageBucket: "carebot-c77b2.firebasestorage.app",
  messagingSenderId: "366792698675",
  appId: "1:366792698675:web:61e751186f22b68734ec46",
  measurementId: "G-TEEL9LZTMR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);