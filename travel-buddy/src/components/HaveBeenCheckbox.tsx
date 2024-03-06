import React, { useState } from 'react';
import DestinationBox from './DestinationBox';
import '../styles/HaveBeenCheckbox.css';


interface HaveBeenProps {
    id: string;
    onFilterChange: (selectedDestinations: string[]) => void;
}

const HaveBeenCheckbox: React.FC<HaveBeenProps> = ({onFilterChange}) => {
    const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);

    //this method handles the checkbox mechanism  
    const handleHaveBeenClick = (id: string) => {
        const isSelected = selectedDestinations.includes(id);
        const newSelectedDestinations = isSelected
            ? selectedDestinations.filter(t => t !== id)
            : [...selectedDestinations, id];
        setSelectedDestinations(newSelectedDestinations);
        onFilterChange(newSelectedDestinations);
    };

    return (
        <div id="checkboxHaveBeen-container">
            {selectedDestinations.map((id) => (
                <React.Fragment key={id}>
                    <input
                        type="checkbox"
                        value={id}
                        checked={selectedDestinations.includes(id)}
                        onChange={() => handleHaveBeenClick(id)}
                    />
                    {/* <label>{id}</label> displays destination ID, might not need */}
                </React.Fragment>
            ))}
        </div>
    );

    
};

export default HaveBeenCheckbox