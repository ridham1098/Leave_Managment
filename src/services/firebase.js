import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-5pXFKjlmEIZyiVaZuESK3UVWEY8-vfQ",
  authDomain: "leave-f87be.firebaseapp.com",
  projectId: "leave-f87be",
  storageBucket: "leave-f87be.firebasestorage.app",
  messagingSenderId: "178296507610",
  appId: "1:178296507610:web:8b6164c9a70bd51ab729e3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);