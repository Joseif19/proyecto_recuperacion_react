// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBjPUFE2fL48P0wDouDDGASRsqXAA5JaNU",
    authDomain: "partysync-b0c4b.firebaseapp.com",
    projectId: "partysync-b0c4b",
    storageBucket: "partysync-b0c4b.firebasestorage.app",
    messagingSenderId: "893630783643",
    appId: "1:893630783643:web:f4d6c73ff43b72b256663e"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
