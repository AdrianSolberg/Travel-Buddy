// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { update } from "firebase/database";
import {
  getFirestore, collection, getDocs,
  addDoc,
  doc,
  query,
  where,
  documentId,
  updateDoc,
  deleteDoc,
  DocumentData
} from "firebase/firestore"
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
const db = getFirestore(app);
export const auth = getAuth(app)

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

  async getReviewForDestinationUser(userID: string | undefined, reviews: DocumentData[]) {
    const filteredReviews = reviews.filter(review => review.userID == userID)
    console.log("")
    return filteredReviews;
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
    const collectionRef = collection(db, "destinations");
    try {
      const newDocRef = await addDoc(collectionRef, {
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
  async getDestinationIDsForUser(userID: string): Promise<string[]> {
    const userDestinationsCol = collection(db, "user_destinations");
    const q = query(userDestinationsCol, where("userID", "==", userID));
    const querySnapshot = await getDocs(q);
    const destinationIDs: string[] = querySnapshot.docs.map(doc => doc.data().destinationID);
    return destinationIDs;
  }
  // Method to retrieve the list of destinations from the collection destinations that have the IDs from destinationIDs
  async getVisitedDestinations(destinationIDs: Promise<string[]>): Promise<DocumentData[]> {
    const newDestinationIDs = await destinationIDs;
    if(newDestinationIDs.length == 0 || newDestinationIDs == null || newDestinationIDs == undefined){
      return []
    }
    const collectionRef = collection(db, "destinations");
    // Create a query to fetch documents whose IDs are in the destinationIDs array
    const q = query(collectionRef, where(documentId(), "in", newDestinationIDs));
    const snapshot = await getDocs(q);
    // Map over the documents in the snapshot to get their data
    const filteredDestinations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return filteredDestinations;
  }










  async editDestination(destinationID: string, updateCity?: string, updateCountry?: string, updateImgURL?: string, updateCategories?: string[], updateDescription?: string) {
    const docRef = doc(db, "destinations", destinationID);
    try {
      await updateDoc(docRef, {
        imgUrl: updateImgURL,
        category: updateCategories,
        description: updateDescription
      });
    }
    catch(e) {
      console.error(e);
    }
  }

  async deleteDestination(destinationID: string) {
    try {
      await deleteDoc(doc(db, "destinations", destinationID))
    }
    catch(e) {
      console.log(e);
    }
  }

  async addReview(destinationID: string, rating: number, comment: string, email: string | null, userID: string | null) {
    const docRef = collection(db, "destinations", destinationID, "reviews");
    try {
        const newDocRef = await addDoc(docRef, {
          rating: rating,
          comment: comment,
          email: email,
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
