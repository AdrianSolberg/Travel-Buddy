import React, { FC } from 'react';
import '../styles/DestinationModal.css';

interface DestinationInterface {
    country: string;
    city: string;
    rating: string;
    tags: string[];
    description: string;
    imgURL: string;
    onClose: () => void;
}

// Note: The button must be alignes with the rating-stars when they are added
const DestinationModal: React.FC<DestinationInterface> = ({country, city, rating, tags, description, imgURL, onClose}) => {

    return (
        <div id='modal-container' className='not-blur'>
            <button id='x-button' onClick={onClose} className='not-blur'>X</button>
            <img src={imgURL} alt="Error loading image" className='not-blur'/>
            <div id='info-container' className='not-blur'>
                <div id='title-container' className='not-blur'>
                    <h1 className='not-blur'>{city}, {country}</h1>
                </div>
                <div id="rating-container" className='addPadding not-blur'>
                    {rating ? 'Rating: ' + rating : 'This destination does not have a rating yet'}
                </div>
                <div id='tag-container' className='addPadding not-blur'>
                    {tags.length ? 'Tags: ' + tags.join(", ") : 'There are no tags for this destination'}
                </div>
                <div id="description-container" className='addPadding not-blur'>
                    {description ? description : 'No description for this destiantion'}
                </div>
            </div>
        </div>
    );
}

export default DestinationModal;
