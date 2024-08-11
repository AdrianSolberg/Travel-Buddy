import '@testing-library/jest-dom';
import { act, fireEvent, render, waitFor } from '@testing-library/react'
import DestinationBox from '../components/DestinationBox';
import { Rating } from '@mui/material';

jest.mock('../components/WeatherDisplay');
describe(DestinationBox, () => {
    it("renders without error when all props are valid", () => {
        const onReadMoreMock = jest.fn();
        const { container } = render(<DestinationBox country='Country' city='City' rating={5} imgURL='https://media.snl.no/media/132105/article_topimage_Oslo_SNL.png' onReadMore={onReadMoreMock} isLoggedIn={true} user={undefined} id={'testId'}/>);        
        
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

        const imgElement = container.querySelector('img');
        expect(imgElement?.getAttribute('src')).toEqual('https://media.snl.no/media/132105/article_topimage_Oslo_SNL.png');
        expect(imgElement?.getAttribute('alt')).toEqual('Error loading image');
    });

    it("allows clicking read more when logged in", () => {
        const onReadMoreMock = jest.fn();
        const { getByRole } = render(<DestinationBox country='Country' city='City' rating={5} imgURL='https://media.snl.no/media/132105/article_topimage_Oslo_SNL.png' onReadMore={onReadMoreMock} isLoggedIn={true} user={undefined} id={'testId'}/>);        
        const button = getByRole('button', {name: 'Read More'})
        fireEvent.click(button);
        expect(onReadMoreMock).toHaveBeenCalled();
    });

    it("does not allow reading more when not logged in", () => {
        const onReadMoreMock = jest.fn();
        window.alert = () => {};  
        const mockAlert = jest.spyOn(window, 'alert');
        const { getByRole } = render(<DestinationBox country='Country' city='City' rating={5} imgURL='https://media.snl.no/media/132105/article_topimage_Oslo_SNL.png' onReadMore={onReadMoreMock} isLoggedIn={false} user={undefined} id={'testId'}/>);        
        const button = getByRole('button', {name: 'Read More'})
        fireEvent.click(button);
        expect(onReadMoreMock).not.toHaveBeenCalled();
        expect(mockAlert).toHaveBeenCalled();
    });

    it("shows rating stars", () => {
        const onReadMoreMock = jest.fn();
        const { getByTestId } = render(<DestinationBox country='Country' city='City' rating={5} imgURL='https://media.snl.no/media/132105/article_topimage_Oslo_SNL.png' onReadMore={onReadMoreMock} isLoggedIn={true} user={undefined} id={'testId'}/>);        
        const rating = getByTestId('rating');
        expect(rating).toBeInTheDocument();
    });
});