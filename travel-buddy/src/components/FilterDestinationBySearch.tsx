// import React from 'react';
import React, { useState } from 'react';
import FilterMenu from './FilterMenu';
import { DocumentData } from 'firebase/firestore';

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

export default filteredDestinationsSearch;