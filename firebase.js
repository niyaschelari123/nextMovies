// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBsqL5o7ZrTEVDc6vlKKnpNeA_HC1cFzrk",
  authDomain: "moviesandtvshows-1c402.firebaseapp.com",
  projectId: "moviesandtvshows-1c402",
  storageBucket: "moviesandtvshows-1c402.appspot.com",
  messagingSenderId: "167719554520",
  appId: "1:167719554520:web:837db7a1e75add43e276ad",
  measurementId: "G-03EZYLLC9Y"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(); // You can also export auth if needed
export const database = getFirestore(app); // Corrected to getFirestore

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);