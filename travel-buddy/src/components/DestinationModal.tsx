import React, { useEffect, useState } from 'react';
import '../styles/DestinationModal.css';
import firebaseControl from '../app/firebaseControl';
import { DocumentData } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { Rating } from '@mui/material';
import HaveBeenCheckbox from './HaveBeenCheckbox';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

interface DestinationInterface {
    id: string;
    country: string;
    city: string;
    rating: string;
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

    useEffect(() => {
        firebasecontroller.getReviewsForDestination(id).then((reviews) => {
            setReviewList(JSON.parse(JSON.stringify(reviews)));
        });
        setIsVisited(visited);
    }, []);

    useEffect(() => {
        if (user) {
            const myReviews = reviewList.filter(review => review.email === user.email);
            if (myReviews.length !== 0) {
                setMyReviewID(myReviews[0].reviewID);
            }
        }
    }, [reviewList]);

    const handleCommentChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setComment(event.target.value);
    }

    const submitReview = () => {
        if (user && !myReviewID) {
            firebasecontroller.addReview(id, activeStar, comment, user.email, user.uid);
        }
        firebasecontroller.getReviewsForDestination(id).then((reviews) => {
            setReviewList(JSON.parse(JSON.stringify(reviews)));
        });
    } 

    function deleteConfirmation() {
        let text = "Are you sure you wan't to delete this destination?\nClick either OK or Cancel.";
        if (confirm(text) && onDelete) {
            onDelete();
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
                    <HaveBeenCheckbox id={id} user={user}/>
                </div>
                <div id="rating-container" className='addPadding not-blur'>
                    {rating ? 'Rating: ' + rating : 'This destination does not have a rating yet'}
                </div>
                <div id='tag-container' className='addPadding not-blur'>
                    {tags.length ? 'Tags: ' + tags?.join(", ") : 'There are no tags for this destination'}
                </div>
                <div id="description-container" className='addPadding not-blur'>
                    {description ? description : 'No description for this destiantion'}
                </div>
                {!myReviewID &&
                    <div id='myrating-container' className='addPadding not-blur'>
                        Add review:
                        <div id="starRating" className='not-blur'>
                            <Rating name="half-rating" defaultValue={2.5} precision={0.5} onChange={(event, value) => setActiveStar(value as number)}/> 
                        </div>
                        <textarea id="review-destinations" rows={1} value={comment} onChange={handleCommentChange} placeholder="Optional comment"></textarea>
                        <button id="submit-review" className="addPadding not-blur"  onClick={submitReview}>Submit</button>
                    </div>
                }
                {reviewList.filter(review => review.comment !== "" && review.comment).length != 0 && 
                    <div id="reviewfeed-container" className='addPadding not-blur'>
                        <h3>Reviews</h3>
                        {reviewList.filter(review => review.comment !== "" && review.comment).map((review) => (
                            <div id='singlereview-container'>
                                <hr/>
                                <div id='top-of-review'>
                                    {review.email}
                                    {review.reviewID === myReviewID && 
                                        <FontAwesomeIcon id='edit-button' className='not-blur' icon={faPenToSquare} />
                                    }
                                </div>
                                    <Rating name="half-rating" defaultValue={review.rating} precision={0.5} readOnly/>
                                <div>{review.comment}</div>
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
