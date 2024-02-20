import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react'
import DestinationModal from '../components/DestinationModal';

describe(DestinationModal, () => {
    it("renders without error when all props are valid", () => {
        const onCloseMock = jest.fn();
        const { container } = render(<DestinationModal country='Country' city='City' rating='5' tags={['city', 'Europe']} description='A really nice city' imgURL='https://media.snl.no/media/132105/article_topimage_Oslo_SNL.png' onClose={onCloseMock}/>);        
        
        expect(container.querySelector('#modal-container')).toBeInTheDocument();

        const button = container.querySelector('button');
        expect(button).toBeInTheDocument();
        expect(button?.textContent).toEqual<string>('X');

        if (button) {
            fireEvent.click(button);
            expect(onCloseMock).toHaveBeenCalled();
        }

        const imgElement = container.querySelector('img');
        expect(imgElement?.getAttribute('src')).toEqual('https://media.snl.no/media/132105/article_topimage_Oslo_SNL.png');
        expect(imgElement?.getAttribute('alt')).toEqual('Error loading image');

        const title = container.querySelector('h1');
        expect(title).toBeInTheDocument();
        expect(title?.textContent).toEqual<string>('City, Country');

        const rating = container.querySelector('#rating-container');
        expect(rating).toBeInTheDocument();
        expect(rating?.textContent).toEqual<string>('Rating: 5');

        const tags = container.querySelector('#tag-container');
        expect(tags).toBeInTheDocument();
        expect(tags?.textContent).toEqual<string>('Tags: city, Europe');

        const description = container.querySelector('#description-container');
        expect(description).toBeInTheDocument();
        expect(description?.textContent).toEqual<string>('A really nice city');
    });

    it("handles missing parameters", () => {
        const onCloseMock = jest.fn();
        const { container } = render(<DestinationModal country='Country' city='City' rating='' tags={[]} description='' imgURL='https://media.snl.no/media/132105/article_topimage_Oslo_SNL.png' onClose={onCloseMock}/>);        

        const rating = container.querySelector('#rating-container');
        expect(rating).toBeInTheDocument();
        expect(rating?.textContent).toEqual<string>('This destination does not have a rating yet');

        const tags = container.querySelector('#tag-container');
        expect(tags).toBeInTheDocument();
        expect(tags?.textContent).toEqual<string>('There are no tags for this destination');

        const description = container.querySelector('#description-container');
        expect(description).toBeInTheDocument();
        expect(description?.textContent).toEqual<string>('No description for this destiantion');
    });
});