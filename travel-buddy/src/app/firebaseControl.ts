// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore, collection, getDocs,
  addDoc,
  doc
} from "firebase/firestore"
// import filterDestinationsByType from "../components/FilterDestinations";
// import filteredDestinationsSearch from "../components/FilterDestinations";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWui1W0CBRAzvrMqHCOBUc3hMkmo3KkXw",
  authDomain: "tdt4140-prosjekt.firebaseapp.com",
  databaseURL: "https://tdt4140-prosjekt-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tdt4140-prosjekt",
  storageBucket: "tdt4140-prosjekt.appspot.com",
  messagingSenderId: "807771308285",
  appId: "1:807771308285:web:43ebb655b020317c987e94"
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
    const destinationsList = destinationsSnapshot.docs.map(doc =>  ({
      id: doc.id,
      ...doc.data()
    }));
    return destinationsList;
  }

  // Method to retrieve the destinationIDs that matches userID from the user_destinations collection
  async getVisitedDestinationsForUserID(userID: string): Promise<string[]> {
    try {
      const user_destinationsCol = collection(db, "user_destinations");
      const user_destinationsSnapshot = await getDocs(user_destinationsCol);
      const userDestinations = user_destinationsSnapshot.docs.filter(ud => ud.get("userID") == userID);
      const destinationIDs: string[] = [];
      userDestinations.forEach(doc => {
        destinationIDs.push(doc.data().destinationID);
      });
      return destinationIDs;
    } catch (error) {
      console.error('Error getting destinationIDs:', error);
      throw error;
    }
  }

  // Method to retrieve the list of destinations from the collection destinations that have the IDs from destinationIDs
  async getVisitedDestinationsForUser(destinationIDs: string[]) {
    const filteredDestinations = destinationIDs.map(async (destinationID) => {
      const destinationsCol = collection(db, "destinations", destinationID);
      const destinationsSnapshot = await getDocs(destinationsCol);
      const destinationsList = destinationsSnapshot.docs.map(doc =>  ({
        id: doc.id,
        ...doc.data()
      }));
      return destinationsList;
    })
    return filteredDestinations;
  }

  

  async getReviewsForDestination(destinationID: string) {
    const reviewsCol = collection(db, "destinations", destinationID, "reviews");
    const reviewsSnapshot = await getDocs(reviewsCol);
    const reviewList = reviewsSnapshot.docs.map(reviewDoc => ({
        reviewID: reviewDoc.id,
        ...reviewDoc.data()
    }));
    return reviewList;
  }

  

  async addDestination(addCity: string, addCountry: string, addImgURL?: string, addCategory?: string[], addDescription?: string) {
    const docRef = collection(db, "destinations");
    try {
      const newDocRef = await addDoc(docRef, {
        city: addCity,
        country: addCountry,
        imgUrl: addImgURL,
        category: addCategory,
        description: addDescription || ""
      });

      const newReviewsCol = collection(newDocRef, "reviews");
      await addDoc(newReviewsCol, {});
    }
    catch (e) {
      console.error(e)
    }
  }

  async addReview(destinationID: string, rating: number, userID: string) {
    const docRef = collection(db, "destinations", destinationID, "reviews");
    try {
        const newDocRef = await addDoc(docRef, {
          rating: rating,
          userID: userID
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