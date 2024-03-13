import React, { useEffect, useState } from 'react';
import '../styles/DestinationBox.css';
import WeatherDisplay from '../components/WeatherDisplay';
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import HaveBeenPin from './HaveBeenPin';
import { User } from 'firebase/auth'; 
import firebaseControl from '../app/firebaseControl';

interface DestinationInterface {
    country: string;
    city: string;
    rating: string;
    imgURL: string;
    onReadMore?: () => void;
    isLoggedIn: boolean;
    id: string 
    user: User | undefined;
    onVisitToggle: (id: string) => void;
    visitedDestinations: string[];

}

// Note: The button must be alignes with the rating-stars when they are added
const DestinationBox: React.FC<DestinationInterface> = ({country, city, rating, imgURL, onReadMore, isLoggedIn, user, id, onVisitToggle, visitedDestinations}) => {
    

    return (
        <div className='box'>
        <img src={imgURL} alt="Error loading image" className='inner-div' />
        <div className='inner-div info-div'>
            <h1>{city}</h1>
            <h2>{country}</h2>
        </div>
        <div className='inner-div more-div'>
            <div className='rating-container'>
                <p>{rating}</p>
            </div>
            <div className='weather-container'>
                <WeatherDisplay country={country} city={city} />
            </div>
            <div className='pin-readmore-container'>
                <div className='pin-container'>
                    <HaveBeenPin id={id} user={user}/>
                </div>
                <div className="button-container">
                    <button onClick={isLoggedIn ? onReadMore : () => alert('Please log in to read more')}>
                        Read More
                    </button>
                </div>
            </div>
            
        </div>
    </div>

    );
    
}

export default DestinationBox;
