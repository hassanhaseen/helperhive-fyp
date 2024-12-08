// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Import Firebase auth
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_XrEpItN1MIf0kd9jUe69yhrSbPRpxHI",
  authDomain: "helperhive-92eb3.firebaseapp.com",
  projectId: "helperhive-92eb3",
  storageBucket: "helperhive-92eb3.appspot.com", // Correcting the `storageBucket` format
  messagingSenderId: "868280060458",
  appId: "1:868280060458:web:bbcb79e7dac825f1c69153",
  measurementId: "G-LPR8PZ56WQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize Firebase Authentication
const db = getFirestore(app); // Initialize Firestore

// Export the initialized modules
export { auth, db, analytics };
