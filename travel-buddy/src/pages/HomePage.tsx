"use client";
import { DocumentData } from 'firebase/firestore';
import React from 'react';
import DestinationBox from '../components/DestinationBox';
import FilterPanel from '../components/FilterPanel';
import { useEffect, useState } from 'react';
import firebaseControl from '../app/firebaseControl';
import '../styles/HomePage.css';
// import filter from '../components/FilterDestinations';

const HomePage = () => {
    const [destinationList, setDestinationList] = useState<DocumentData[]>([]);

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

    const categories_dict = {
        "Activities": ["Hiking", "Skiing", "Sightseeing"], 
        "Climate": ["Tropical", "Dry", "Continental", "Polar", "Temperate"],
        "Destination type": ["City", "Beach", "Culture", "Safari", "Historical", "Active"]
    }

    return (
        <div id='container'>
            <FilterPanel categories={categories_dict} onFilterChange={function (selectedTags: string[]): void {
                throw new Error('Function not implemented.');
            } }/>
            {cities()}
        </div>
    );
};

export default HomePage;
