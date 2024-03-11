"use client";
import React from 'react';
import { useState } from 'react';
import firebaseControl from "../app/firebaseControl";
import '../styles/AddDestination.css'
import { DocumentData } from 'firebase/firestore';


interface AddDestinationInterface {
    onClose: () => void;
    checkDuplicates: (country: string, city: string, destinations: DocumentData[]) => boolean;
    destinationList: DocumentData[];
}

const AddDestination: React.FC<AddDestinationInterface> = ({onClose, checkDuplicates, destinationList}) => {

    const firebaseController = new firebaseControl;
    const [continent, setContinent] = useState('');
    const [climate, setClimate] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [imgUrl, setImage] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [categories, setCategories] = useState<string[]>([]);

    const categories_dict = {
        "Activities": ["Hiking", "Skiing", "Sightseeing"], 
        "Destination type": ["City", "Beach", "Culture", "Safari", "Historical", "Active"]
    }
    

    const handleSubmit = async () => {
        const categoriesList: string[] = [];
        if (checkDuplicates(country, city, destinationList)) {
            setStatus('This destination already exists')
        }
        else if (city !== '' && country !== '' && imgUrl !== '' && climate !== '' && continent!==''){
            categoriesList.push(continent);
            categoriesList.push(climate);
            categories.map(cat => categoriesList.push(cat));
    
            await firebaseController.addDestination(
                city,
                country,
                imgUrl,
                categoriesList,
                description
            )
            onClose?.();
        }
        else {
            setStatus("Fill inn all fields")
        }
    }

    const categoryCheckbox = () => {
            const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const category = e.target.value;
                const checked = e.target.checked;
                if (checked) {
                    setCategories(prev => [...prev, category])
                }
                else {
                    const newList = categories;
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
                                    <input type='checkbox' className='not-blur' value={tag} onChange={handleCheckboxChange}/>
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
        <div id='addDestination' className='not-blur'>
            <button id='x-button' onClick={onClose} className='not-blur'>X</button>
            <div id='addDestination-inner' className='not-blur'>
                <h1 className='not-blur'>New travel destination</h1>
                <h5 id='statusMessage' className='not-blur'>{status}</h5>
                <form className='not-blur'>
                    <label className='not-blur'>
                        City:
                        <input name='city' className='not-blur' onChange={e => setCity(e.target.value)}/>
                    </label>
                    <label className='not-blur'>
                        Country:
                        <input name='country' className='not-blur' onChange={e => setCountry(e.target.value)} />
                    </label>
                    <label className='not-blur'>
                        Image url:
                        <input name='imgURL' className='not-blur' onChange={e => setImage(e.target.value)}/>
                    </label>
                    <h3 className='not-blur'>Apply tags</h3>
                    <select className='not-blur' defaultValue='' onChange={e => setContinent(e.target.value)}>
                        <option value='' disabled>continent</option>
                        <option value='africa'>Africa</option>
                        <option value='asia'>Asia</option>
                        <option value='europe'>Europe</option>
                        <option value='northAmerica'>North-America</option>
                        <option value='southAmerica'>South-America</option>
                        <option value='oceania'>Oceania</option>
                    </select>
                    <select className='not-blur' defaultValue='' onChange={e => setClimate(e.target.value)}>
                        <option value='' disabled>climate</option>
                        <option value='continental'>Continental</option>
                        <option value='dry'>Dry</option>
                        <option value='polar'>Polar</option>
                        <option value='temperate'>Temperate</option>
                        <option value='tropical'>Tropical</option>
                    </select>
                    <div className='not-blur' id='checkbox-container'>
                        {categoryCheckbox()}
                    </div>
                </form>
                <h4 className='not-blur'>Description</h4>
                <textarea className='not-blur' rows={12} cols={60} style={{ resize: "none" }} onChange={e => setDescription(e.target.value)}/>
                <button id='addButton' className='not-blur' onClick={handleSubmit}> Add new destination </button>
            </div>
        </div>
    );
}

export default AddDestination;
