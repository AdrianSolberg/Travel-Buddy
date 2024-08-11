import '@testing-library/jest-dom'; 
import filterDestinationsByType from '../components/FilterDestinations';
import filteredDestinationsSearch from '../components/FilterDestinationBySearch';
import { DocumentData } from 'firebase/firestore';

// interface Destination {
//     city: string;
//     country: string;
//     category: string[]; // Assuming category is an array of strings
// }

describe('filterDestinationsByType', () => {
    const destinations: DocumentData[] = [
        { city: 'Paris', country: 'France', category: ['City', 'Culture'] },
        { city: 'Rome', country: 'Italy', category: ['City', 'Historical'] },
        { city: 'Tokyo', country: 'Japan', category: ['City', 'Culture'] },
    ];

    

    it('returns all destinations when no tags are provided', () => {
        const filteredDestinations = filterDestinationsByType(destinations);
        expect(filteredDestinations).toEqual(destinations);
    });

    it('filters destinations by provided tags', () => {
        const filteredDestinations = filterDestinationsByType(destinations, ['culture']);
        expect(filteredDestinations).toHaveLength(2); // Paris and Tokyo
        expect(filteredDestinations).toEqual([
            { city: 'Paris', country: 'France', category: ['City', 'Culture'] },
            { city: 'Tokyo', country: 'Japan', category: ['City', 'Culture'] },
        ]);
    });

    it('returns an empty array if no destinations match provided tags', () => {
        const filteredDestinations = filterDestinationsByType(destinations, ['beach']);
        expect(filteredDestinations).toEqual([]);
    });

    it('returns a single destinations by provided tags', () => {
        const filteredDestinations = filterDestinationsByType(destinations, ['city', 'HIstorical']);
        expect(filteredDestinations).toEqual([{ city: 'Rome', country: 'Italy', category: ['City', 'Historical'] }]);
    });
});

describe('filteredDestinationsSearch', () => {
    const destinationsForSearch: DocumentData[] = [
        { city: 'Paris', country: 'France', category: ['City', 'Culture'] },
        { city: 'Rome', country: 'Italy', category: ['City', 'Historical'] },
        { city: 'Tokyo', country: 'Japan', category: ['City', 'Culture'] },
        { city: 'Yukoshima', country: 'Japan', category: null },
    ];

    it('returns all destinations when search query is empty', () => {
        const filteredDestinations = filteredDestinationsSearch(destinationsForSearch, '');
        expect(filteredDestinations).toEqual(destinationsForSearch);
    });

    it('filters destinations by search query', () => {
        const filteredDestinations = filteredDestinationsSearch(destinationsForSearch, 'Rome');
        expect(filteredDestinations).toHaveLength(1);
        expect(filteredDestinations[0]).toEqual({ city: 'Rome', country: 'Italy', category: ['City', 'Historical'] });
    });

    it('filters destinations by search query case-insensitively', () => {
        const filteredDestinations = filteredDestinationsSearch(destinationsForSearch, 'tokyo');
        expect(filteredDestinations).toHaveLength(1); // Tokyo
        expect(filteredDestinations[0].city).toEqual('Tokyo');
    });

    it('returns empty array if no destinations match search query', () => {
        const filteredDestinations = filteredDestinationsSearch(destinationsForSearch, 'beach');
        expect(filteredDestinations).toEqual([]);
    });
});