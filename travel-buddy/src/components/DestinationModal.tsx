import React, { useEffect, useState } from 'react';
import '../styles/DestinationModal.css';
import firebaseControl from '../app/firebaseControl';
import { DocumentData } from 'firebase/firestore';
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
    onClose?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

// Note: The button must be alignes with the rating-stars when they are added
const DestinationModal: React.FC<DestinationInterface> = ({id, country, city, rating, tags, description, imgURL, admin, onClose, onEdit, onDelete}) => {
    const [reviewList, setReviewList] = useState<DocumentData[]>([]);

    useEffect(() => {
        const firebasecontroller = new firebaseControl();
        firebasecontroller.getReviewsForDestination(id).then((reviews) => {
            setReviewList(JSON.parse(JSON.stringify(reviews)));
        });
    }, []);

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
                admin && <button id='delete-button' className='not-blur' onClick={onDelete}>
                    Delete
                    <FontAwesomeIcon id='icon' className='not-blur' icon={faTrashCan}/>
                </button>
            }
            </div>
            <div id='info-container' className='not-blur'>
                <div id='title-container' className='not-blur'>
                    <h1 className='not-blur'>{city}, {country}</h1>
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
