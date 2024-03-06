import React, { useEffect, useState } from 'react';
import '../styles/DestinationModal.css';
import firebaseControl from '../app/firebaseControl';
import { DocumentData } from 'firebase/firestore';
import { User } from 'firebase/auth';
import HaveBeenCheckbox from './HaveBeenCheckbox';


interface DestinationInterface {
    id: string;
    country: string;
    city: string;
    rating: string;
    tags: string[];
    description: string;
    imgURL: string;
    onClose?: () => void;
    user: User;
    destinationIDs: string;
    onFilterChange: (selectedDestinations: string[]) => void;
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
    onClose, 
    user, 
    destinationIDs, 
    onFilterChange}) => {
    
    const [reviewList, setReviewList] = useState<DocumentData[]>([]);

    useEffect(() => {
        const firebasecontroller = new firebaseControl();
        firebasecontroller.getReviewsForDestination(id).then((reviews) => {
            setReviewList(JSON.parse(JSON.stringify(reviews)));
        });
    }, []);

    const handleUserDestinations = async () => {
        try {
            const firebasecontroller = new firebaseControl();
            await firebasecontroller.setUser(user.uid, id);
            console.log("Destination added to user's list:", id);
        } catch (error) {
            console.error("Error adding destination to user's list:", error);
        }
    };


    return (
        <div id='modal-container' className='not-blur'>
            <button id='x-button' onClick={onClose} className='not-blur'>X</button>
            <img src={imgURL} alt="Error" className='not-blur'/>
            <div id='info-container' className='not-blur'>
                <div id='title-container' className='not-blur'>
                    <h1 className='not-blur'>{city}, {country}</h1>

                    <button onClick={handleUserDestinations} className='not-blur' style={{ marginLeft: '10px'}}>I've been here</button>
                    {/* <HaveBeenCheckbox id={id} onFilterChange={onFilterChange} /> */}

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
            </div>
        </div>
    );
}

export default DestinationModal;
