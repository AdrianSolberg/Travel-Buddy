"use client";
import React, {useState} from 'react';
import HomePage from '../pages/HomePage';
import firebaseControl from './firebaseControl';
import { useEffect } from 'react';
import { getDocs } from 'firebase/firestore';
import { DocumentData } from 'firebase/firestore';
import FilterMenu from '../components/FilterMenu';
//import Login from '../components/LoginComponent';
import '../components/Header'

export default function Home() {
    const firebasecontroller = new firebaseControl;
    //const [loginButtonPopup, setLoginButtonPopup] = useState(false);

    /* useEffect(() => {
        //fetch destinastions and store in localstorage
        let destinastions: DocumentData[] = [];
        firebasecontroller.getDestinastions().then((destinationsFirebase) => {
            destinastions = destinationsFirebase;
            localStorage.setItem("destinations", JSON.stringify(destinastions));
        });
    }, []); */


    return(
        <div>
            <HomePage/>
        </div>
    )


}
 
