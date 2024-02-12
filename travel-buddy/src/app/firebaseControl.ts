// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, getDocs,
  addDoc
} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWui1W0CBRAzvrMqHCOBUc3hMkmo3KkXw",
  authDomain: "tdt4140-prosjekt.firebaseapp.com",
  projectId: "tdt4140-prosjekt",
  storageBucket: "tdt4140-prosjekt.appspot.com",
  messagingSenderId: "807771308285",
  appId: "1:807771308285:web:43ebb655b020317c987e94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);