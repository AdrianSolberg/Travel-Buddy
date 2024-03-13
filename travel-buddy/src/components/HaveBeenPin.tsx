import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin } from '@fortawesome/free-solid-svg-icons';
import firebaseControl from '@/app/firebaseControl';
import { User } from 'firebase/auth';

interface HaveBeenProps {
    user: User | undefined;
    id: string;
}

const HaveBeenPin: React.FC<HaveBeenProps> = ({ user, id }) => {
    const [isVisited, setIsVisited] = useState(false);

    useEffect(() => {
        const checkVisited = async () => {
            try {
                const firebasecontroller = new firebaseControl();
                const visited = await firebasecontroller.checkIfVisited(user?.uid, id);
                setIsVisited(visited);
                
            } catch (error) {
                console.error("Error checking if visited:", error);
            }
        };
        checkVisited();
    }, []);

    const handleIconClick = async () => {
        try {
            const firebasecontroller = new firebaseControl();
            if (!isVisited) {
                await firebasecontroller.setUser(user?.uid, id);
                console.log("Destination added to user's list:", id);
            } else {
                await firebasecontroller.removeUserDestination(user?.uid, id);
                console.log("Destination removed from user's list:", id);
            }
            setIsVisited(!isVisited); 
        } catch (error) {
            console.error("Error handling icon click:", error);
        }
    };

    return (
        <div>
            <div style={{ display: "flex", flexDirection: 'row', alignItems: 'center' }} onClick={handleIconClick}>
                <FontAwesomeIcon icon={faMapPin} style={{ color: isVisited ? '#00FF00' : 'gray', cursor: 'pointer', fontSize: '24px' }} />
                <span style={{ marginLeft: '0.5rem' }}>Visited</span>
            </div>
        </div>
    );
};

export default HaveBeenPin;