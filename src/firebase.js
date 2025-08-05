// src/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWZh_hHTDBqgAvPzWxmNBTqiUj3eqMl2o",
  authDomain: "two-seas-llp.firebaseapp.com",
  projectId: "two-seas-llp",
  storageBucket: "two-seas-llp.firebasestorage.app",
  messagingSenderId: "762862325873",
  appId: "1:762862325873:web:c1c408818257ee52728bd0",
  measurementId: "G-WC32TCG3QJ"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, db, ref, uploadBytes, getDownloadURL, collection, addDoc };