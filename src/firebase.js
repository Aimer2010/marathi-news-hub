// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBbWq30MQatgIDhvSjEJxtvWOD1y8SHVO0",
  authDomain: "newskatta-auth-41fd3.firebaseapp.com",
  projectId: "newskatta-auth-41fd3",
  storageBucket: "newskatta-auth-41fd3.firebasestorage.app",
  messagingSenderId: "492881870012",
  appId: "1:492881870012:web:4629ea11c3714d9ce324b9",
  measurementId: "G-LYKKT7Y7SN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication and Export it
export const auth = getAuth(app);