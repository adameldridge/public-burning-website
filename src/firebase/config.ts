import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDjg3jPZcAF76OSKmfHXNK-UCsUNXBJX4Q",
  authDomain: "public-burning.firebaseapp.com",
  projectId: "public-burning",
  storageBucket: "public-burning.firebasestorage.app",
  messagingSenderId: "635338359476",
  appId: "1:635338359476:web:6f1392361a2ec630410de1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)