import React, { useEffect, useState } from 'react';
import '../styles/DestinationModal.css';
import firebaseControl from '../app/firebaseControl';
import { DocumentData } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { Rating } from '@mui/material';
import HaveBeenCheckbox from './HaveBeenCheckbox';
import WeatherDisplay from '../components/WeatherDisplay';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan, faCircleArrowLeft, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
// import ReviewRating from './ReviewRating';

interface DestinationInterface {
    id: string;
    country: string;
    city: string;
    rating: number;
    tags: string[];
    description: string;
    imgURL: string;
    admin: boolean;
    user: User | undefined;
    onClose?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    visited?: any;
}



// Note: The button must be alignes with the rating-stars when they are added
// Note: Currently, rating is hard coded in. Should fetch from firestore.
const DestinationModal: React.FC<DestinationInterface> = ({
    id, 
    country, 
    city, 
    rating, 
    tags, 
    description, 
    imgURL, 
    admin, 
    onClose, 
    user,
    visited, 
    onEdit, 
    onDelete}) => {
    
    const [reviewList, setReviewList] = useState<DocumentData[]>([]);
    const [activeStar, setActiveStar] = useState<number>(2.5);
    const [comment, setComment] = useState<string>("");
    const [myReviewID, setMyReviewID] = useState<string>("");
    const firebasecontroller = new firebaseControl();
    const [isVisited, setIsVisited] = useState<Boolean>(false);
    const [isEditingReview, setIsEditingReview] = useState<boolean>(false);
    const [avgRating, setAvgRating] = useState<number>(rating);
    const [ratingChanged, setRatingChanged] = useState<boolean>(false); 

    useEffect(() => {
        firebasecontroller.getReviewsForDestination(id).then((reviews) => {
            setReviewList(JSON.parse(JSON.stringify(reviews)));
        });
        setIsVisited(visited);
    }, []);

    useEffect(() => {
        firebasecontroller.getDestination(id).then((dest) => {
            setAvgRating(dest?.RatingCount == 0 ? 0 : dest?.TotalRating / dest?.RatingCount);
            setRatingChanged(false);
        })
    }, [ratingChanged]);

    useEffect(() => {
        if (user) {
            const myReviews = reviewList.filter(review => review.userID === user.uid);
            if (myReviews.length !== 0) {
                setMyReviewID(myReviews[0].reviewID);
                setComment(myReviews[0].comment);
                setActiveStar(myReviews[0].rating);
            }
        }
    }, [reviewList]);

    const handleCommentChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setComment(event.target.value);
    }

    const submitReview = () => {
        if (user && !myReviewID) {
            firebasecontroller.checkIfVisited(user.uid, id).then((check) => {
                if (check) {
                    firebasecontroller.addReview(id, activeStar, comment, user.email, user.uid).then(() => {
                        setRatingChanged(true);
                    }).then(() => {
                        firebasecontroller.getReviewsForDestination(id).then((reviews) => {
                            setReviewList(JSON.parse(JSON.stringify(reviews)));
                        });
                    });
                } else {
                    alert("You can not give a review on a destination you have not visited.");
                }
            })

        }    
    } 

    const updateReview = () => {
        firebasecontroller.updateReview(id, myReviewID, activeStar, comment).then(() => {
            firebasecontroller.getReviewsForDestination(id).then((reviews) => {
                setReviewList(JSON.parse(JSON.stringify(reviews)));
            });
            setRatingChanged(true);
            setIsEditingReview(false);
        });
    }

    const deleteReview = () => {
        firebasecontroller.deleteReview(id, myReviewID).then(() => {
            stateChangesWhenDeleteReview();
        });
    } 

    const stateChangesWhenDeleteReview = () => {
        firebasecontroller.getReviewsForDestination(id).then((reviews) => {
            setReviewList(JSON.parse(JSON.stringify(reviews)));
        });
        setRatingChanged(true);
        setIsEditingReview(false);
        setMyReviewID("");
        setComment("");
        setActiveStar(2.5);
    }

    function deleteConfirmation() {
        let text = "Are you sure you want to delete this destination?\nClick either OK or Cancel.";
        if (confirm(text) && onDelete) {
            onDelete();
        } 
    }

    const deleteReviewConfirmation = () => {
        let text = "Are you sure you want to delete this review?\nClick either OK or Cancel.";
        if (confirm(text)) {
            deleteReview();
        } 
    }

    const showEditOrAdd = () => {
        if (!myReviewID) {
            return (
                <div id='myrating-container' className='addPadding not-blur'>
                    Add review:
                    <div id="starRating" className='not-blur'>
                        <Rating name="half-rating" defaultValue={2.5} precision={0.5} onChange={(event, value) => setActiveStar(value as number)}/> 
                    </div>
                    <textarea id="review-destinations" rows={1} value={comment} onChange={handleCommentChange} placeholder="Optional comment"></textarea>
                    <button id="submit-review" className="addPadding not-blur"  onClick={submitReview}>Submit</button>
                </div>
            )
        }
        else if (isEditingReview) {
            return (
                <div>
                    {reviewList.filter(review => review.reviewID === myReviewID).map((review) => (
                        <div key={review.reviewID} id='myrating-container' className='addPadding not-blur'>
                            Edit your review:
                            <div id="starRating" className='not-blur'>
                                <Rating name="half-rating" defaultValue={review.rating} precision={0.5} onChange={(event, value) => setActiveStar(value as number)}/> 
                            </div>
                            <textarea id="review-destinations" rows={1} onChange={handleCommentChange} defaultValue={review.comment}></textarea>
                            <div >
                                <FontAwesomeIcon id='back-review' className='not-blur' icon={faCircleArrowLeft} onClick={() => setIsEditingReview(false)}/>
                                <FontAwesomeIcon id='update-review' className='not-blur' icon={faCircleCheck} onClick={updateReview}/>
                                <FontAwesomeIcon id='delete-review' className='not-blur' icon={faTrashCan} onClick={deleteReviewConfirmation}/>
                            </div>
                        </div>
                    ))
                    }
                </div>
            )
        }
        else {
            return (
                <div id='reviewfeed-container' className='addPadding not-blur'>
                    <h3>My Review</h3>
                    <hr/>
                    {reviewList.filter(review => review.reviewID === myReviewID).map((review) => (
                        <div key={review.reviewID} style={{justifyContent: 'space-between'}}>
                            <div id='top-of-review'>
                                <div style={{opacity: 0.5}}>
                                    {review.email}
                                </div>
                                <FontAwesomeIcon id='edit-button' className='not-blur' icon={faPenToSquare} onClick={() => setIsEditingReview(true)}/>
                            </div>
                            <Rating style={{opacity: 0.5}} name="half-rating" value={review.rating} precision={0.5} readOnly/>
                            <div style={{opacity: 0.5}}>
                                {review.comment}
                            </div>
                        </div>
                    ))
                    }
                </div>
            )
        }
    }

    return (
        <div id='modal-container' className='not-blur'>
            <button id='x-button' onClick={onClose} className='not-blur'>X</button>
            <img src={imgURL} alt="Error" className='not-blur'/>
            <div id='admin-buttons' className='not-blur'>
            {
                admin &&
                <button id='edit-button' onClick={onEdit} className='not-blur'>
                    Edit <FontAwesomeIcon id='icon' className='not-blur' icon={faPenToSquare} />
                </button>
            }
            {
                admin && <button id='delete-button' className='not-blur' onClick={deleteConfirmation}>
                    Delete
                    <FontAwesomeIcon id='icon' className='not-blur' icon={faTrashCan}/>
                </button>
            }
            </div>
            <div id='info-container' className='not-blur'>
                <div id='title-container' className='not-blur'>
                    <h1 className='not-blur'>{city}, {country}</h1>
                </div>
                <div id="visited-container" className='addPadding not-blur'>
                    <HaveBeenCheckbox id={id} user={user} extraHandling={() => stateChangesWhenDeleteReview()}/>
                </div>
                <div id="weather-display-container" className='addPadding not-blur'>
                    <WeatherDisplay country={country} city={city}/>
                </div>
                <div id="rating-container" className='addPadding not-blur'>
                    <Rating name="average-rating" precision={0.25} value={avgRating} readOnly/> 
                </div>
                <div id='tag-container' className='addPadding not-blur'>
                    {tags.length ? 'Tags: ' + tags?.join(", ") : 'There are no tags for this destination'}
                </div>
                <div id="description-container" className='addPadding not-blur'>
                    {description ? description : 'No description for this destiantion'}
                </div>
                {showEditOrAdd()}
                {reviewList.filter(review => review.comment !== "" && review.comment && review.reviewID !== myReviewID).length != 0 && 
                    <div id="reviewfeed-container" className='addPadding not-blur'>
                        <h3>All Reviews</h3>
                        {reviewList.filter(review => review.comment !== "" && review.comment && review.reviewID !== myReviewID).map((review) => (
                            <div key={review.reviewID}>
                                <hr/>
                                <div id='singlereview-container'>
                                    <div id='top-of-review'>
                                        {review.email}
                                    </div>
                                    <Rating name="half-rating" value={review.rating} precision={0.5} readOnly/>
                                    <div>{review.comment}</div>
                                </div>
                            </div>
                        ))
                        }
                    </div>
                }
            </div>
        </div>
    );
}

export default DestinationModal;
