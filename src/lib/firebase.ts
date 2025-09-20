import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    "projectId": "studio-237864977-b0c92",
    "appId": "1:887440902076:web:385ef169e76d5775704db9",
    "apiKey": "AIzaSyDRkV3KP4qgAp2nVTrgQcCUq3kJ7y7ZJJg",
    "authDomain": "studio-237864977-b0c92.firebaseapp.com",
    "measurementId": "",
    "messagingSenderId": "887440902076"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
