// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore, collection, getDocs,
  addDoc,
  doc
} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCj5CanDTH_T1opQ1OegZ1bypZUFIGxOfQ",
  authDomain: "test-5c378.firebaseapp.com",
  databaseURL: "https://test-5c378-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "test-5c378",
  storageBucket: "test-5c378.appspot.com",
  messagingSenderId: "453126250081",
  appId: "1:453126250081:web:3a3ba8b1ee5477b2271420",
  measurementId: "G-3V8H39KJPL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app)

/* class firebaseControl {
  static getAuth(): import("@firebase/auth").Auth {
    //throw new Error('Method not implemented.');
    return auth;
  } */

  class firebaseControl {
    static getAuth() {
      return auth;
    }

  async getDestinastions(){
    const destinationsCol = collection(db, "destinations");
    const destinationsSnapshot = await getDocs(destinationsCol);
    const destinationsList = destinationsSnapshot.docs.map(doc => doc.data());
    return destinationsList;
  }

  async addDestination(addCity: string, addCountry: string, addImgURL?: string, addCategory?: string[], addDescription?: string) {
    const docRef = collection(db, "destinations");
    try {
      await addDoc(docRef, {
        city: addCity,
        country: addCountry,
        imgUrl: addImgURL,
        category: addCategory,
        description: addDescription || ""
      });
    }
    catch (e) {
      console.error(e)
    }
  }
  getAuthInstance() {
    return auth;
  }

  

};

export default firebaseControl;