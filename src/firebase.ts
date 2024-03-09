import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKjleL2Cd37P8JgGY4HGFUKJgefbnCVBE",
  authDomain: "education-5db9e.firebaseapp.com",
  projectId: "education-5db9e",
  storageBucket: "education-5db9e.appspot.com",
  messagingSenderId: "315875647114",
  appId: "1:315875647114:web:4a6f90986b25ca7d9bd773",
  measurementId: "G-53QXG4C7GE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
