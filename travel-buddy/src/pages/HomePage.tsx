"use client";
import { DocumentData } from 'firebase/firestore';
import React from 'react';
import DestinationBox from '../components/DestinationBox';
import { useEffect, useState } from 'react';
import firebaseControl, { auth } from '../app/firebaseControl';
import '../styles/HomePage.css';
import { User, onAuthStateChanged } from 'firebase/auth';
import { Route, useNavigate } from 'react-router-dom';
import Link from 'next/link';
import Login from '../components/LoginComponent';

const HomePage = () => {
    const [destinationList, setDestinationList] = useState<DocumentData[]>([]);
    //const navigate = useNavigate();
    const [user, setUser] = useState<User>();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user);
            //navigate("/admin/event/create");
        } else {
            //navigate("/login")
        }
        });
    }, [])
    async function signOut() {
        setUser(undefined);
        await auth.signOut();
    }

    useEffect(() => {
        const firebasecontroller = new firebaseControl;

        let destinastions: DocumentData[] = [];
        firebasecontroller.getDestinastions().then((destinationsFirebase) => {
            setDestinationList(JSON.parse(JSON.stringify(destinationsFirebase)));
        });

      }, [])
    
    const listAllDestinations: string[][] = [];
    for (const destination of destinationList){
        let listDestination: string[] = [];
        listDestination.push(destination.city);
        listDestination.push(destination.country);
        listDestination.push(destination.rating);
        listDestination.push(destination.imgUrl);
        listAllDestinations.push(listDestination);
    }

    const cities = () => {
        return (
            <>
            {listAllDestinations.map((destin) => (
                <DestinationBox city={destin[0]} country={destin[1]} rating={destin[2]} imgURL={destin[3]}/>
            ))}
            </>
        );
    }


    return (
        <div id='container'>
            {cities()}
        </div>
    );
};

export default HomePage;
