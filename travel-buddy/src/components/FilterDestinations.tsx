// import React from 'react';
import React, { useState } from 'react';
import FilterMenu from './FilterMenu';
import { DocumentData } from 'firebase/firestore';


// interface Destination {
//     continent: string;
//     country: string;
//     city: string;
//     category: string[];
// }
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

export default filterDestinationsByType;


