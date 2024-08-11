"use client";
import React, { useEffect } from 'react';
import { useState } from 'react';
import firebaseControl from "../app/firebaseControl";
import '../styles/EditDestination.css'

interface EditDestinationInterface {
    id: string;
    city: string;
    country: string;
    tags: string[];
    currentDescription: string;
    currentImgUrl: string;
    onClose?: () => void;
    visited?: any;
}

const EditDestination: React.FC<EditDestinationInterface> = ({id, city, country, tags, currentDescription, currentImgUrl, onClose}) => {

    const firebaseController = new firebaseControl;
    const [climate, setClimate] = useState("");
    const [imgUrl, setImage] = useState(currentImgUrl);
    const [description, setDescription] = useState(currentDescription);
    const [status, setStatus] = useState('');
    const [categories, setCategories] = useState<string[]>(tags);
    const [hasNewChanges, setHasChanges] = useState(false);

    const categories_dict = {
        "Activities": ["Hiking", "Skiing", "Sightseeing"], 
        "Destination type": ["City", "Beach", "Culture", "Safari", "Historical", "Active"]
    }

    const continents: string[] = ['asia', 'europe', 'northAmerica', 'southAmerica', 'oceania'];
    const climateTypes: string[] = ['continental', 'dry', 'polar', 'temperate','tropical'];

    
    const setNewClimate = (newClimate: string) => {
        setClimate(newClimate);
        setCategories(prev => prev.filter(c => !climateTypes.includes(c)))
        setCategories(prev => [...prev, newClimate]);
    }

    const hasChanges = () => {
        for (let i = 0; i < categories.length; i++) {
            if (!tags.includes(categories[i])) {
                return true;
            }
        }
        for (let i = 0; i < tags.length; i++) {
            if (!categories.includes(tags[i])) {
                return true;
            }
        }
        return climate != "" || currentDescription != description;
    }
    
    const handleSubmit = async () => {
        if (hasChanges()){  
            await firebaseController.editDestination(
                id,
                imgUrl,
                categories,
                description
            )
            onClose?.();
        }
        else {
            setStatus("No changes were made")
        }
    }

    const isChecked = (box: string) => {
        return categories.indexOf(box) > -1;
    }

    const categoryCheckbox = () => {
            const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const category = e.target.value;
                const checked = e.target.checked;
                if (checked) {
                    if(!categories.includes(category)) {
                        setCategories(prev => [...prev, category])
                    }
                }
                else {
                    setCategories(prev => prev.filter(cat => cat !== category));
                }
            }

        return (
            <>
                {Object.entries(categories_dict).map(([category, tags]) => (
                    <div className='not-blur' key={category}>
                        <h4 className='not-blur'>{category}</h4>
                        <div className='not-blur' id='category-checkbox-container'>
                            {tags.map(tag => (
                                <label className='not-blur' key={tag}>
                                    <input type='checkbox' className='not-blur' defaultChecked={isChecked(tag)} value={tag} onChange={handleCheckboxChange}/>
                                    {tag}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </>
        );
    };

    
    
    return (
        <div id='editBox' className='not-blur'>
            <h1 className='not-blur'>Edit destination</h1>
            <h5 id='statusmessage' className='not-blur'>{status}</h5>
            <button id='x-button' onClick={onClose} className='not-blur'>X</button>
            <div id='editDestination' className='not-blur'>
                <div id='display-current-destination' className='not-blur'>
                    <img src={imgUrl} alt="Error" className='not-blur'/>
                    <h2 className='not-blur'>{city}, {country}</h2>
                </div>
                <div id='editDestination-inner' className='not-blur'>
                    <form className='not-blur'>
                        <label className='not-blur'>
                            Image url:
                            <input name='imgURL' id='imgURL' className='not-blur' onChange={e => setImage(e.target.value)}/>
                        </label>
                        <select className='not-blur' defaultValue='' onChange={e => setNewClimate(e.target.value)}>
                            <option value='' disabled>climate</option>
                            <option value='continental'>Continental</option>
                            <option value='dry'>Dry</option>
                            <option value='polar'>Polar</option>
                            <option value='temperate'>Temperate</option>
                            <option value='tropical'>Tropical</option>
                        </select>
                        <div className='not-blur' id='edit-checkboxes'>
                            {categoryCheckbox()}
                        </div>
                    </form>
                    <h4 className='not-blur'>Description</h4>
                    <textarea className='not-blur' defaultValue={currentDescription} rows={12} cols={60} style={{ resize: "none" }} onChange={e => setDescription(e.target.value)}/>
                    <button id='editButton' className='not-blur' onClick={handleSubmit}>Update destination</button>
                </div>
            </div>
        </div>
    );
}

export default EditDestination;
