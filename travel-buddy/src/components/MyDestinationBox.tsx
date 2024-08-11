import React, { useEffect, useState } from 'react';
import '../styles/MyDestinationBox.css';
import WeatherDisplay from '../components/WeatherDisplay';
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Rating } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan, faCircleArrowLeft, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import firebaseControl from '@/app/firebaseControl';
import { Pause } from '@mui/icons-material';
import HaveBeenCheckbox from './HaveBeenCheckbox';
import { User } from 'firebase/auth';

interface DestinationInterface {
    country: string;
    city: string;
    imgURL: string;
    onReadMore?: () => void;
    isLoggedIn: boolean;
    review?: string;
    myRating?: any;
    averageRating: number;
    destinationID: string;
    reviewID?: string;
    reviewDelete: (destinationID: string, reviewID: string) => void;
    reviewSubmit: (destinationID: string, rating: number, comment: string | undefined) => void;
    reviewUpdate: (destinationID: string, reviewID: string | undefined, rating: number, comment: string | undefined) => void;
    user?: User;
    visitedHandling: () => void;
}

// Note: The button must be alignes with the rating-stars when they are added
const MyDestinationBox: React.FC<DestinationInterface> = ({
    country, 
    city, 
    imgURL, 
    onReadMore, 
    isLoggedIn, 
    review, 
    myRating, 
    averageRating, 
    destinationID, 
    reviewID, 
    reviewDelete, 
    reviewSubmit,
    reviewUpdate,
    user,
    visitedHandling}) => {

    const [isEditingReview, setIsEditingReview] = useState<boolean>(false);
    const [activeStar, setActiveStar] = useState<number>(myRating?myRating:0);
    const [comment, setComment] = useState<string | undefined>(review);
    const [avgRating, setAvgRating] = useState<number>(averageRating);
    const [ratingChanged, setRatingChanged] = useState<boolean>(false); 

    useEffect(() => {
        const firebasecontroller = new firebaseControl();
        firebasecontroller.getDestination(destinationID).then((dest) => {
            setAvgRating(dest?.RatingCount == 0 ? 0 : dest?.TotalRating / dest?.RatingCount);
            setRatingChanged(false);
        })
    }, [ratingChanged]);

    const deleteReview = () => {
        if (!reviewID) {
            return;
        }
        reviewDelete(destinationID, reviewID);
        setActiveStar(2.5);
        setComment("");
        setRatingChanged(true);
        setIsEditingReview(false);
    } 

    const deleteReviewConfirmation = () => {
        let text = "Are you sure you want to delete this review?\nClick either OK or Cancel.";
        if (confirm(text)) {
            deleteReview();
        } 
    }

    const handleCommentChange = (event: { target: { value: React.SetStateAction<string | undefined>; }; }) => {
        setComment(event.target.value);
    }

    const updateReview = () => {
        reviewUpdate(destinationID, reviewID, activeStar, comment);
        setIsEditingReview(false);
        setRatingChanged(true);
    }

    const submitReview = () => {
        reviewSubmit(destinationID, activeStar, comment);
        setRatingChanged(true);
    }

    const back = () => {
        setIsEditingReview(false)
    }

    const showReview = () => {
        if(isEditingReview) {
            return (
                <div id='edit-container'>
                    Edit your review:
                    <div id="starRating" className='not-blur'>
                        <Rating name="half-rating" defaultValue={myRating} precision={0.5} onChange={(event, value) => setActiveStar(value as number)}/> 
                    </div>
                    <textarea id="review-destinations" rows={1} onChange={handleCommentChange} defaultValue={review}></textarea>
                    <div >
                        <FontAwesomeIcon id='back-review' className='not-blur' icon={faCircleArrowLeft} onClick={() => back()}/>
                        <FontAwesomeIcon id='update-review' className='not-blur' icon={faCircleCheck} onClick={() => updateReview()}/>
                        <FontAwesomeIcon id='delete-review' className='not-blur' icon={faTrashCan} onClick={deleteReviewConfirmation}/>
                    </div>
                </div>
            )
        }
        else if (myRating) {
            return (
                <div>
                    <div id='top-half-review'>
                        <h3>Your review for {city}</h3>
                        <FontAwesomeIcon id='edit-button' className='not-blur' icon={faPenToSquare} onClick={() => setIsEditingReview(true)}/>
                    </div>
                    <Rating name="half-rating" value={myRating} precision={0.5} readOnly/>
                    {review && <p>{review}</p>}
                </div>
            )
        }
        else {
            return (
                <div id='edit-container'>
                    Add review:
                    <div id="starRating" className='not-blur'>
                        <Rating name="half-rating" defaultValue={2.5} precision={0.5} onChange={(event, value) => setActiveStar(value as number)}/> 
                    </div>
                    <textarea id="review-destinations" rows={1} onChange={handleCommentChange} placeholder="Optional comment"></textarea>
                    <button id="submit-review" className="addPadding not-blur"  onClick={() => submitReview()}>Submit</button>
                </div>
            )
        }
    }

    return (
        <div>
            <div className='outer-box'>
                <div className='box' id='box'>
                    <img src={imgURL} alt="Error loading image" className='inner-div' />
                    <div className='inner-div info-div'>
                        <h1>{city}</h1>
                        <h2>{country}</h2>
                    </div>
                    <div className='inner-div more-div'>
                        <div className='rating-container'>
                            <Rating name="half-rating" value={avgRating} precision={0.25} readOnly/>
                        </div>
                        <div className='weather-container'>
                            <div style={{marginRight: '10px'}}>
                                {typeof user !== "undefined" && <HaveBeenCheckbox user={user} id={destinationID} extraHandling={visitedHandling}/>}
                            </div>
                            <WeatherDisplay country={country} city={city} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='review-container' id='review'>
                {showReview()}
            </div>
        </div>
    );
}

export default MyDestinationBox;
