import React, { useEffect, useState } from 'react';
import '../styles/DestinationBox.css';
import WeatherDisplay from '../components/WeatherDisplay';
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

interface DestinationInterface {
    country: string;
    city: string;
    rating: string;
    imgURL: string;
    onReadMore?: () => void;
    isLoggedIn: boolean;
}

// Note: The button must be alignes with the rating-stars when they are added
const DestinationBox: React.FC<DestinationInterface> = ({country, city, rating, imgURL, onReadMore, isLoggedIn}) => {

    return (
        <div className='box' id='box'>
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
                <div className="button-container">
                    <button onClick={isLoggedIn ? onReadMore : () => alert('Please log in to read more')}>
                    Read More</button>
                </div>
            </div>
        </div>
    );
}

export default DestinationBox;
