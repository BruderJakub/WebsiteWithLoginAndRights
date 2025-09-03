// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace with your Firebase project's configuration
const firebaseConfig = {
    apiKey: "AIzaSyBbYu0D3wM3TEtMOO7wP9LOIYPN5Ow_2v0",
    authDomain: "website-with-login.firebaseapp.com",
    projectId: "website-with-login",
    storageBucket: "website-with-login.firebasestorage.app",
    messagingSenderId: "182429076904",
    appId: "1:182429076904:web:9afe64ce0d5025a76ba19d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore and get a reference to the service
export const db = getFirestore(app);
