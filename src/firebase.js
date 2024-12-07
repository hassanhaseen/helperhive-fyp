// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Import Firebase auth

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_XrEpItN1MIf0kd9jUe69yhrSbPRpxHI",
  authDomain: "helperhive-92eb3.firebaseapp.com",
  projectId: "helperhive-92eb3",
  storageBucket: "helperhive-92eb3.firebasestorage.app",
  messagingSenderId: "868280060458",
  appId: "1:868280060458:web:bbcb79e7dac825f1c69153",
  measurementId: "G-LPR8PZ56WQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize auth

export { auth }; // Export auth