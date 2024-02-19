import React, { useEffect, useState } from 'react';
import DestinationBox from '../components/DestinationBox';
import FilterPanel from '../components/FilterPanel';
import firebaseControl from '../app/firebaseControl';
import '../styles/HomePage.css';
import { useRouter } from 'next/navigation';
import NewDestination from '@/pages/NewDestination';
import DestinationModal from '../components/DestinationModal';
import filterDestinationsByType from '../components/FilterDestinations';
import { DocumentData } from 'firebase/firestore';

const HomePage = () => {
    const [tags, setTags] = useState<string[]>([]);
    const [destinationList, setDestinationList] = useState<DocumentData[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [destIndex, setDestIndex] = useState(0);
    const [scrollMem, setScrollMem] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        const firebasecontroller = new firebaseControl();

        // let destinations: DocumentData[] = [];
        firebasecontroller.getDestinastions().then((destinationsFirebase) => {
            setDestinationList(JSON.parse(JSON.stringify(destinationsFirebase)));
        });

    }, [])


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

    return (
        <div id='container' className={openModal ? 'blur-background' : undefined}>
        
        {openModal && <div className="overlay"></div>}
            {openModal && 
                <DestinationModal 
                city={filteredDestinationsSearch(filterDestinationsByType(destinationList, tags), searchQuery)[destIndex].city} 
                country={filteredDestinationsSearch(filterDestinationsByType(destinationList, tags), searchQuery)[destIndex].country}
                rating={filteredDestinationsSearch(filterDestinationsByType(destinationList, tags), searchQuery)[destIndex].rating}
                tags={filteredDestinationsSearch(filterDestinationsByType(destinationList, tags), searchQuery)[destIndex].category}
                description={filteredDestinationsSearch(filterDestinationsByType(destinationList, tags), searchQuery)[destIndex].description}
                imgURL={filteredDestinationsSearch(filterDestinationsByType(destinationList, tags), searchQuery)[destIndex].imgUrl}
                onClose={() => closeModal()}/>}

        <div id='filter-container'>
            <FilterPanel categories={categories_dict} onFilterChange={onFilterChange}/>
        </div>
        <div id='feed-container'>
            <input type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Search destinations"/>
            {cities()}
            <button onClick={() => router.push('/NewDestination')}>Add new travel destination</button> 
        </div>
    </div>
    );
};

export default HomePage;
