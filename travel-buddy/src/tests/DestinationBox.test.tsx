import '@testing-library/jest-dom';
import { render } from '@testing-library/react'
import DestinationBox from '../components/DestinationBox';

describe(DestinationBox, () => {
    it("renders without error when all props are valid", () => {
        const { container } = render(<DestinationBox country='Country' city='City' rating='5' imgURL='https://media.snl.no/media/132105/article_topimage_Oslo_SNL.png' isLoggedIn={true}/>);        
        
        expect(container.querySelector('.box')).toBeInTheDocument();

        
        const button = container.querySelector('button');
        expect(button).toBeInTheDocument();
        expect(button?.textContent).toEqual<string>('Read More');

        const city = container.querySelector('h1');
        expect(city).toBeInTheDocument();
        expect(city?.textContent).toEqual<string>('City');

        const country = container.querySelector('h2');
        expect(country).toBeInTheDocument();
        expect(country?.textContent).toEqual<string>('Country');

        const rating = container.querySelector('p');
        expect(rating).toBeInTheDocument();
        expect(rating?.textContent).toEqual<string>('5');

        const imgElement = container.querySelector('img');
        expect(imgElement?.getAttribute('src')).toEqual('https://media.snl.no/media/132105/article_topimage_Oslo_SNL.png');
        expect(imgElement?.getAttribute('alt')).toEqual('Error loading image');
    });
});