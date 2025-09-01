// src/firebase.js
import { initializeApp } from "firebase/app";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  uploadBytesResumable,
  getDownloadURL 
} from "firebase/storage";
import { 
  getFirestore, 
  doc, 
  updateDoc, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  getDoc 
} from "firebase/firestore";
import { 
  getAnalytics, 
  logEvent 
} from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MSG_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Export everything you need
export { 
  db, 
  storage, 
  analytics, 
  // Firestore functions
  doc, 
  updateDoc, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  getDoc,
  // Storage functions
  ref, 
  uploadBytes, 
  uploadBytesResumable,
  getDownloadURL,
  // Analytics
  logEvent
};
