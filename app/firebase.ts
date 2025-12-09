import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDevj1x7V2C9MYf4uEgqPkMFk3py15xMnk",
  authDomain: "ig-map-collection.firebaseapp.com",
  projectId: "ig-map-collection",
  storageBucket: "ig-map-collection.firebasestorage.app",
  messagingSenderId: "382787100378",
  appId: "1:382787100378:web:87f9c11dbc4bd7e81d4fe3",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
