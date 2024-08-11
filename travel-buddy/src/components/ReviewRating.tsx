import React from 'react';
import '../styles/ReviewRating.css';

interface ReviewRatingInterface {
    rating: number;
}

// Note: The button must be alignes with the rating-stars when they are added
const ReviewRating: React.FC<ReviewRatingInterface> = ({ rating }) => {
    return (
        <div className="rating not-blur">
            <div className="rating-upper not-blur" style={{ width: rating / 5 * 100 + "%" }}>
                <span className="not-blur">★</span>
                <span className="not-blur">★</span>
                <span className="not-blur">★</span>
                <span className="not-blur">★</span>
                <span className="not-blur">★</span>
            </div>
            <div className="rating-lower not-blur">
                <span className="not-blur">★</span>
                <span className="not-blur">★</span>
                <span className="not-blur">★</span>
                <span className="not-blur">★</span>
                <span className="not-blur">★</span>
            </div>
        </div>
    );
}

export default ReviewRating;