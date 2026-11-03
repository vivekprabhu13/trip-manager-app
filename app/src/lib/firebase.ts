// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics"; // Analytics is optional for now

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAtwDqs4h54g3HW-42sRqLwaPPWnZTZLTI",
    authDomain: "trip-planner-app-b6744.firebaseapp.com",
    projectId: "trip-planner-app-b6744",
    storageBucket: "trip-planner-app-b6744.firebasestorage.app",
    messagingSenderId: "900381801746",
    appId: "1:900381801746:web:7ebc697148068e6001c7cb",
    measurementId: "G-LL5WH5HQN2"
};

// Initialize Firebase
// use getApps() to avoid re-initialization errors in Next.js hot-reloading
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
// const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, db, auth, storage };
