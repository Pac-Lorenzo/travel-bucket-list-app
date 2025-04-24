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
  apiKey: "AIzaSyDAov6yR3LkPyy5x_2ZFY4D87bMcMc2jnw",
  authDomain: "bucketlist-41856.firebaseapp.com",
  projectId: "bucketlist-41856",
  storageBucket: "bucketlist-41856.firebasestorage.app",
  messagingSenderId: "289122432817",
  appId: "1:289122432817:web:25ee72ab12f99354542210",
  measurementId: "G-876LDPBJ4D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
