import { initializeApp } from 'firebase/app'
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage"

const firebaseConfig = {
    apiKey: String(import.meta.env.VITE_FIREBASE_API_KEY),
    authDomain: String(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
    projectId: String(import.meta.env.VITE_FIREBASE_PROJECT_ID),
    storageBucket: String(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_ID),
    messagingSenderId: String(import.meta.env.VITE_FIREBASE_MESSAGING_ID),
    appId: String(import.meta.env.VITE_FIREBASE_APP_ID),
    measurementId: String(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID)
}

const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)