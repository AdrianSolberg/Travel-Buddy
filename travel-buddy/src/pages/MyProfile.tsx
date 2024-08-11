import React, { useEffect, useState } from 'react';
import MyDestinationBox from '../components/MyDestinationBox';
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
import Header from '../components/Header';
import '../styles/MyDestinationBox.css';


const ProfilePage = () => {
    const [tags, setTags] = useState<string[]>([]);
    const [destinationList, setDestinationList] = useState<DocumentData[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [destIndex, setDestIndex] = useState<number>(0);
    const [scrollMem, setScrollMem] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [openAddDestination, setOpenAddDestination] = useState<boolean>(false);
    const [destinationsChanged, setDestinationsChanged] = useState<boolean>(false);
    const router = useRouter();
    const [user, setUser] = useState<User>();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isAdmin, setAdmin] = useState<boolean>(false);
    const [userEmail, setUserEmail] = useState<string | undefined>('');

    useEffect(() => {
        setUserEmail(localStorage.getItem("user")?.replace(/"/g, ""));
    }, [])

    useEffect(() => {
    
        const unsubscribe = auth.onAuthStateChanged((userAuth) => {
            if (userAuth) {
                setUser(userAuth);
            } else {
                setUser(undefined);
                setOpenModal(false);
                setOpenAddDestination(false);
            }
        });
        
        if (userEmail === 'theamariabruno@gmail.com' || userEmail === 'juliadai03@gmail.com' || userEmail === 'adrianhsolberg@gmail.com') {
            setAdmin(true);
        } else {
            setAdmin(false);
        }
        
    }, [destinationsChanged, isLoggedIn, userEmail])


    const fetchReviewForDestination = async (userId:string|undefined, destinationId:string) => {
        const fbcontroller = new firebaseControl();
        return await fbcontroller.getReviewForDestinationUser(userId, destinationId);
    };

    useEffect(() => {
        const firebasecontroller = new firebaseControl();
        const getVisitedDestinationsForUser = auth.onAuthStateChanged((userAuth) => {
            if (userAuth) {
                const idu = userAuth.uid
                const destinationIDs = firebasecontroller.getDestinationIDsForUser(idu);
                firebasecontroller.getVisitedDestinations(destinationIDs).then(async (destinationsFirebase) => {
                    const destList: DocumentData[] = JSON.parse(JSON.stringify(destinationsFirebase));

                    const combinedData = await Promise.all(destList.map(async (dest) => {
                        const myReview = await fetchReviewForDestination(user?.uid, dest.id);
                        if (myReview && myReview.length > 0) {
                            return {
                                rating: myReview[0].rating,
                                comment: myReview[0].comment,
                                reviewID: myReview[0].reviewID,
                                ...dest
                            };
                        } else {
                            return {
                                rating: null,
                                comment: null,
                                reviewID: null,
                                ...dest
                            };
                        }
                    }));
                    setDestinationsChanged(false);
                    setDestinationList(combinedData);
                });
            }
        });
    }, [user, destinationsChanged])

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

/**
     * Validation method to check if there already exists a destination of the provided city and country
     * @param destinations The list of destinations that already exists
     * @param country  The country of the destination to be created
     * @param city The city of the destination to be created
     * @returns true if destination exists, false otherwise
     */
    const isDestinationDuplicate = (destinations: DocumentData[], country: string, city: string): boolean => {
        const destinationsOfCity = filteredDestinationsSearch(destinations, country)
        const destinationsOfCountry = filteredDestinationsSearch(destinations, city)

        return (destinationsOfCity.length > 0 && destinationsOfCountry.length > 0) ? true: false
    }
    
    const reviewDelete = (destinationID: string, reviewID:string) => {
        const firebasecontroller = new firebaseControl();
        firebasecontroller.deleteReview(destinationID, reviewID).then(() => {
            setDestinationsChanged(true);
        });
    }

    const reviewSubmit = async (destinationID: string, rating: number, comment: string | undefined) => {
        if (user) {
            const firebasecontroller = new firebaseControl();
            await firebasecontroller.addReview(destinationID, rating, comment ? comment : '', user.email, user.uid);
            setDestinationsChanged(true);
        }    
    }

    const updateReview = (destinationID: string, reviewID: string | undefined, rating: number, comment: string | undefined) => {
        if (!reviewID) {
            return;
        }
        const firebasecontroller = new firebaseControl();
        firebasecontroller.updateReview(destinationID, reviewID, rating, comment ? comment : '').then(() => {
            setDestinationsChanged(true);
        });
    }

    const visitedReRender = () => {
        setDestinationsChanged(true);
    }

    const cities = () => {
        //const firebaseController = new firebaseControl() 
        const filteredAndSearchedDestinations = filteredDestinationsSearch(filterDestinationsByType(destinationList, tags), searchQuery)
        //firebaseController.getReviewForDestinationUser("qQOfqOEzxNS2utynTNJFVZT8Bs43", firebaseController.getReviewsForDestination("dNDQbqz8WLPIbt4iVjbV"))
        if (filteredAndSearchedDestinations.length === 0) {
            return <h1>No destinations found</h1>;
        }
        else {
            return (
                
                <>

                {filteredAndSearchedDestinations.map((destin, i) => (
                    <MyDestinationBox
                        key={i}
                        city={destin.city}
                        country={destin.country}
                        imgURL={destin.imgUrl}
                        //onReadMore={() => readMore(i)}
                        review={destin.comment}
                        myRating={destin.rating}
                        isLoggedIn={!!user}
                        averageRating={destin.RatingCount == 0 ? 0 : destin.TotalRating / destin.RatingCount}
                        destinationID={destin.id}
                        reviewID={destin.reviewID}
                        reviewDelete={reviewDelete}
                        reviewSubmit={reviewSubmit}
                        reviewUpdate={updateReview}
                        user={user}
                        visitedHandling={visitedReRender}
                    />
                    
                ))
                
                }
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
        <div id='container' className={openModal || openAddDestination ? 'blur-background'  : undefined}>
            <Header />
            <div className='header-padding' id='headline'>
                <div id='header-div'>
                    <p className='headline' id='headline'>Your visited destinations</p>
                </div>
                {(openModal || openAddDestination) && <div className="overlay"></div>}
                <div id="search-div">
                    <input type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Search destinations" />
                </div> 
                <div id='filter-container' className='filter-container'> 
                    <FilterPanel categories={categories_dict} onFilterChange={onFilterChange} />
                </div>
                {openModal && user &&
                    <DestinationModal
                    id={filteredDestinationsSearch(filterDestinationsByType(destinationList, tags), searchQuery)[destIndex].id}
                    city={filteredDestinationsSearch(filterDestinationsByType(destinationList, tags), searchQuery)[destIndex].city}
                    country={filteredDestinationsSearch(filterDestinationsByType(destinationList, tags), searchQuery)[destIndex].country}
                    rating={filteredDestinationsSearch(filterDestinationsByType(destinationList, tags), searchQuery)[destIndex].rating}
                    tags={filteredDestinationsSearch(filterDestinationsByType(destinationList, tags), searchQuery)[destIndex].category}
                    description={filteredDestinationsSearch(filterDestinationsByType(destinationList, tags), searchQuery)[destIndex].description}
                    imgURL={filteredDestinationsSearch(filterDestinationsByType(destinationList, tags), searchQuery)[destIndex].imgUrl}
                    user={user}
                    admin={isAdmin}
                    
                    onClose={() => closeModal()}
                    />}
                    
            
                
                <div id='feed-container'>   
                    {cities()}
                </div>
                {openAddDestination && (
                    <AddDestination
                        checkDuplicates={(country, city) => isDestinationDuplicate(destinationList, country, city)}
                        destinationList={destinationList}
                        onClose={() => closeAddDestination()}/>
                )}
            </div>
        </div>
    
    );
};

export default ProfilePage;