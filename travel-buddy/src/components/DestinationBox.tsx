import React, { useEffect, useReducer, useState } from 'react';
import '../styles/DestinationBox.css';
import WeatherDisplay from '../components/WeatherDisplay';
import Box from "@mui/material/Box";
// import StarIcon from "@mui/icons-material/Star";
// import StarBorderIcon from "@mui/icons-material/StarBorder";
import ReviewRating from '../components/ReviewRating';
import { Rating } from '@mui/material';
import HaveBeenCheckbox from './HaveBeenCheckbox';
import { User } from 'firebase/auth';

interface DestinationInterface {
    country: string;
    city: string;
    rating: number;
    imgURL: string;
    onReadMore?: () => void;
    isLoggedIn: boolean;
    user: User | undefined;
    id: string;
}

// Note: The button must be alignes with the rating-stars when they are added
const DestinationBox: React.FC<DestinationInterface> = ({country, city, rating, imgURL, onReadMore, isLoggedIn, user, id}) => {
    const [render, setRender] = useState({state: false});
    return (
        <div className='box' id='box' onClick={isLoggedIn ? onReadMore : () => alert('Please log in to read more')}>
            <img src={imgURL} alt="Error loading image" className='inner-div' />
            <div className='inner-div info-div'>
                <h1>{city}</h1>
                <h2>{country}</h2>
            </div>
            <div className='inner-div more-div'>
                <div className='rating-container'>
                    <Rating data-testid="rating" name="average-rating" value={rating} precision={0.25} readOnly />
                </div>
                <div className='weather-container'>
                    <WeatherDisplay country={country} city={city} />
                </div>
                <div className="button-container">
                    {typeof user !== "undefined" && <HaveBeenCheckbox user={user} id={id} extraHandling={() => {}}/>}
                    <button onClick={isLoggedIn ? onReadMore : () => alert('Please log in to read more')}>
                    Read More</button>
                </div>
            </div>
        </div>
    );
}

export default DestinationBox;
