import React, { useEffect, useState } from 'react';
import firebaseControl from '../app/firebaseControl';
import { User } from 'firebase/auth';
import '../styles/HaveBeenCheckbox.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin } from '@fortawesome/free-solid-svg-icons'
import { DocumentData } from 'firebase/firestore';

interface HaveBeenProps {
    user: User | undefined;
    id: string;
    extraHandling: () => void;
}

const HaveBeenCheckbox: React.FC<HaveBeenProps> = ({ user, id, extraHandling }) => {
    const [isChecked, setIsChecked] = useState(false);

    /* const handleUserDestinations = async () => {
        try {
            const firebasecontroller = new firebaseControl();
            await firebasecontroller.setUser(user.uid, id);
            console.log("Destination added to user's list:", id);
        } catch (error) {
            console.error("Error adding destination to user's list:", error);
        }
    }; */

    const checkRender = () => {
        const checkVisited = async () => {
            try {
                const firebasecontroller = new firebaseControl();
                const visited = await firebasecontroller.checkIfVisited(user?.uid, id);
                setIsChecked(visited);
            } catch (error) {
                console.error("Error checking if visited:", error);
            }
        };
        checkVisited();
    }

    checkRender();
    
    useEffect(() => {
        checkRender();
    }, []);

    const removeVisited = () => {
        const firebasecontroller = new firebaseControl();
        firebasecontroller.removeUserDestination(user?.uid, id).then(() => {
            console.log("User removed from destination's list:", id);
            extraHandling();
        });
    }

    const handleCheckboxChange = async (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        event.stopPropagation();
        try {
            const firebasecontroller = new firebaseControl();
            if (!isChecked) {
                await firebasecontroller.setUserDestination(user?.uid, id);
                console.log("User added to destination's list:", id);
            } else {
                firebasecontroller.getReviewForDestinationUser(user?.uid, id).then((reviews:DocumentData[]) => {
                    const confirmtext = "You have written a review for this destination, and can not have a review for a destination you have not visited.\n If you continue, the review will be deleted."
                    if (reviews.length) {
                        if (confirm(confirmtext)) {
                            firebasecontroller.deleteReview(id, reviews[0].reviewID).then(() => {
                                removeVisited();
                            });
                        } else {
                            return;
                        }
                    }
                    else {
                        removeVisited();
                    }
                });
            }
            setIsChecked(!isChecked); 
        } catch (error) {
            console.error("Error handling checkbox change:", error);
        }
    };

    return (
        <>
            {isChecked ? <FontAwesomeIcon className="visitedIcon" icon={faMapPin} onClick={handleCheckboxChange} style={{color: "#63E6BE",}} /> : <FontAwesomeIcon className="visitedIcon" icon={faMapPin} onClick={handleCheckboxChange} style={{color: "#c0c0c0",}} />}
        </>  
    );
};

export default HaveBeenCheckbox;