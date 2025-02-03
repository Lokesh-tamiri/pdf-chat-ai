import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDPef4O9BKL4-pImwxqiSQ03ZviKX-iDEk",
  authDomain: "ai-saas-be796.firebaseapp.com",
  projectId: "ai-saas-be796",
  storageBucket: "ai-saas-be796.firebasestorage.app",
  messagingSenderId: "456131969395",
  appId: "1:456131969395:web:60313796df5b80c5ae0506",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
