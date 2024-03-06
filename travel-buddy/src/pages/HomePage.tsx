import React, { useEffect, useState } from 'react';
import DestinationBox from '../components/DestinationBox';
import FilterPanel from '../components/FilterPanel';
import firebaseControl, { auth } from '../app/firebaseControl';
import '../styles/HomePage.css';
import { useRouter } from 'next/navigation';
import DestinationModal from '../components/DestinationModal';
import filterDestinationsByType from '../components/FilterDestinations';
import { User, onAuthStateChanged } from 'firebase/auth';
import { Route, useNavigate } from 'react-router-dom';
import Link from 'next/link';
//import Login from '../components/LoginComponent';
import { DocumentData } from 'firebase/firestore';
import AddDestination from '../components/AddDestination';

const HomePage = () => {
    const [tags, setTags] = useState<string[]>([]);
    const [destinationList, setDestinationList] = useState<DocumentData[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [destIndex, setDestIndex] = useState(0);
    const [scrollMem, setScrollMem] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [openAddDestination, setOpenAddDestination] = useState<boolean>(false);
    const [destinationsChanged, setDestinationsChanged] = useState<boolean>(false);
    const router = useRouter();
    //const navigate = useNavigate();
    const [user, setUser] = useState<User>();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setAdmin] = useState(false);
    //const [userEmail, setUserEmail] = useState('');
    const userEmail = localStorage.getItem("user")?.replace(/"/g, "");

    useEffect(() => {
        
/* 
        // let destinations: DocumentData[] = [];
        firebasecontroller.getDestinastions().then((destinationsFirebase) => {
            setDestinationList(JSON.parse(JSON.stringify(destinationsFirebase)));
            setDestinationsChanged(false);
        });
         */
        const unsubscribe = auth.onAuthStateChanged((userAuth) => {
            if (userAuth) {
                setUser(userAuth);
            } else {
                setUser(undefined);
                setOpenModal(false);
                setOpenAddDestination(false);
            }
        });
        
        //setUserEmail(localStorage.getItem('user')?.replace(/'/g,'') ?? '');
        if (userEmail === 'theamariabruno@gmail.com' || userEmail === 'juliadai03@gmail.com' || userEmail === 'adrianhsolberg@gmail.com') {
            setAdmin(true);
        } else {
            setAdmin(false);
        }
        
    }, [destinationsChanged, isLoggedIn, userEmail])

    useEffect(() => {
        const firebasecontroller = new firebaseControl();
        firebasecontroller.getDestinastions().then((destinationsFirebase) => {
            setDestinationList(JSON.parse(JSON.stringify(destinationsFirebase)));
            setDestinationsChanged(false);
        });
    }, [destinationsChanged])

    async function signOut() {
        setUser(undefined);
        await auth.signOut();
    }

    const readMore = (index: number) => {
        setDestIndex(index);
        setOpenModal(true);
        setScrollMem(window.scrollY);
        window.scrollTo(0, 0);
    }

        /**
     * Helper function to check whether the input parameter is empty
     * @param val Value to check
     * @returns true if val is null, false otherwise
     */
    function isEmpty(val: string | any[] | null | undefined){
        return (val === undefined || val == null || val.length <= 0) ? true : false;
    }
    /**
     * Function to filter the list of destinations based on the desired category
     * @param destinations the list of the registered destinations
     * @param category  the category of which we want to filter the list by
     * @returns list of the filtered destinations
     */
    const filterDestinationsByType = (destinations: DocumentData[], tags ?: string[] ): DocumentData[] => {
        if (isEmpty(tags)) {
            return destinations;
        }
        // Convert all category strings to lower case for comparison
        const lowercaseTags = tags!.map(cat => cat.toLowerCase())
        return destinations.filter(destination => {
            // Convert all destination category strings to lower case for comparison
            const lowercaseDestinationTags = destination.category.map((cat: string) => cat.toLowerCase());
            // Check if all lowercase categories in lowercaseCategories are included in lowercaseDestinationCategories
            return lowercaseTags.every(cat => lowercaseDestinationTags.includes(cat));
        })
    }

    

    const filteredDestinationsSearch = (destinations: DocumentData[], searchQuery: string): DocumentData[] => {
        return destinations.filter(destin => {
            const searchQueryLowerCase = searchQuery.toLowerCase();
            const cityName = destin.city.toLowerCase();
            const countryName = destin.country.toLowerCase();
            const category = Array.isArray(destin.category) ? destin.category.map(c => c.toLowerCase()) : [];
            // If searchQuery is empty, return true for all destinations
            if (!searchQueryLowerCase) {
                return true;
            }
            // If searchQuery is not empty, only return true for destinations that include the searchQuery in their category
            return cityName.includes(searchQueryLowerCase) || countryName.includes(searchQueryLowerCase) || category.some(c => c.includes(searchQueryLowerCase));
        });
}
    

    const cities = () => {
        const filteredAndSearchedDestinations = filteredDestinationsSearch(filterDestinationsByType(destinationList, tags), searchQuery)
        if (filteredAndSearchedDestinations.length === 0) {
            return <h1>No destinations found</h1>;
        }
        else {
            return (
                <>
                {filteredAndSearchedDestinations.map((destin, i) => (
                    <DestinationBox
                        key={i}
                        city={destin.city}
                        country={destin.country}
                        rating={destin.rating}
                        imgURL={destin.imgUrl}
                        onReadMore={() => readMore(i)}
                        isLoggedIn={!!user}
                    />
                ))}
                </>
            );
        }
        
    }

    const closeModal = () => {
        setDestIndex(0);
        setOpenModal(false);
        window.scrollTo(0, scrollMem);
        setScrollMem(0);
    }

    const onFilterChange = (t: string[] = []) => {
        setTags(t);        
    }

    const categories_dict = {
        "Activities": ["Hiking", "Skiing", "Sightseeing"], 
        "Climate": ["Tropical", "Dry", "Continental", "Polar", "Temperate"],
        "Destination type": ["City", "Beach", "Culture", "Safari", "Historical", "Active"],
        "Continent": ["Europe", "Asia", "Africa", "North America", "South America", "Oceania"],
    }

    const handleSearchChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSearchQuery(event.target.value);
    }

    const closeAddDestination = () => {
        setOpenAddDestination(false);
        setDestinationsChanged(true);
        window.scrollTo(0, scrollMem);
    }

    const handleLoginChange = (loggedIn: boolean) => {
        setIsLoggedIn(loggedIn);
      };

      

    return (
        <div id='container' className={openModal || openAddDestination ? 'blur-background' : undefined}>
            {isAdmin && (<button id='addDestinationButton' onClick={() => setOpenAddDestination(true)}>
                Add new travel destination
            </button>)} 
            {(openModal || openAddDestination) && <div className="overlay"></div>}
            {openModal &&
                <DestinationModal
                    id={filteredDestinationsSearch(filterDestinationsByType(destinationList, tags), searchQuery)[destIndex].id}
                    city={filteredDestinationsSearch(filterDestinationsByType(destinationList, tags), searchQuery)[destIndex].city}
                    country={filteredDestinationsSearch(filterDestinationsByType(destinationList, tags), searchQuery)[destIndex].country}
                    rating={filteredDestinationsSearch(filterDestinationsByType(destinationList, tags), searchQuery)[destIndex].rating}
                    tags={filteredDestinationsSearch(filterDestinationsByType(destinationList, tags), searchQuery)[destIndex].category}
                    description={filteredDestinationsSearch(filterDestinationsByType(destinationList, tags), searchQuery)[destIndex].description}
                    imgURL={filteredDestinationsSearch(filterDestinationsByType(destinationList, tags), searchQuery)[destIndex].imgUrl}
                    onClose={() => closeModal()} />}
            <div id='search-container'>
                <input type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Search destinations"/>
                
                
            </div>
            <div id='filter-container'>
                <FilterPanel categories={categories_dict} onFilterChange={onFilterChange} />
            </div>
            <div id='feed-container'>
                
                {cities()}
            </div>
            {openAddDestination && (<AddDestination onClose={() => closeAddDestination()} />)}
        </div>
    
    );
};

export default HomePage;