import React from 'react';
import { act, fireEvent, getByLabelText, getByRole, getByTestId, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'; 
import EditDestination from '../components/EditDestination';

describe(EditDestination, () => {
    it('has all the tags', () => {
        const { getByRole } = render(
            <EditDestination
                id={'1234'}
                city={'TestCity'}
                country={'TestCountry'}
                tags={['Sightseeing', 'City', 'Temperate']}
                currentDescription={'testing'} 
                currentImgUrl={'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/576px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg'}
                onClose={() => {}}
            />
        )
        const listCheckboxes: string[] = [
            "Hiking", "Skiing", "Sightseeing", "City",
            "Beach", "Culture", "Safari", "Historical", "Active"
        ]
        listCheckboxes.map(box => {
            const tag = screen.getByLabelText(box);
            expect(tag).toBeInTheDocument;
        })
    })

    it('has the right tags checked', () => {
        const { getByRole } = render(
            <EditDestination
                id={'1234'}
                city={'TestCity'}
                country={'TestCountry'}
                tags={['Sightseeing', 'City', 'Temperate']}
                currentDescription={'testing'} 
                currentImgUrl={'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/576px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg'}
                onClose={() => {}}
            />
        )
        const cityTag = screen.getByLabelText('City');
        expect(cityTag).toBeInTheDocument();
        expect(cityTag).toBeChecked();

        const sightseeingTag = screen.getByLabelText('Sightseeing');
        expect(sightseeingTag).toBeInTheDocument();
        expect(sightseeingTag).toBeChecked();

    })

    it('can set new tags', () => {
        const onCloseMock = jest.fn();
        const { getByRole } = render(
            <EditDestination
                id={'1234'}
                city={'TestCity'}
                country={'TestCountry'}
                tags={['Sightseeing', 'City', 'Temperate']}
                currentDescription={'testing'} 
                currentImgUrl={'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/576px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg'}
                onClose={onCloseMock}
            />
        )

        const climate = screen.getByRole('combobox');
        expect(climate).toBeInTheDocument();
        expect(climate).toHaveValue('');

        fireEvent.click(climate);
        fireEvent.change(climate, {target: {value: 'polar'}});
        expect(climate).toHaveValue('polar');
    })

    it('can be closed', () => {
        const onCloseMock = jest.fn();
        const { getByRole } = render(
            <EditDestination
                id={'1234'}
                city={'TestCity'}
                country={'TestCountry'}
                tags={['Sightseeing', 'City']}
                currentDescription={'City and state in USA'} 
                currentImgUrl={'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/576px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg'}
                onClose={onCloseMock}
            />
        )

        const button = getByRole('button', {name: 'X'})
        fireEvent.click(button);
        expect(onCloseMock).toHaveBeenCalled();
    })

    it('does not allow updating with no new changes', () => {
        const onCloseMock = jest.fn();
        const { getByRole } = render(
            <EditDestination
                id={'1234'}
                city={'TestCity'}
                country={'TestCountry'}
                tags={['Sightseeing', 'City']}
                currentDescription={'City and state in USA'} 
                currentImgUrl={'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/576px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg'}
                onClose={onCloseMock}
            />
        ) 
        const button = getByRole('button', {name: 'Update destination'});
        act(() => {
            fireEvent.click(button);
        })
        const message = screen.getByRole('heading', {name: 'No changes were made'});
        expect(message).toBeInTheDocument();
        expect(message).toHaveTextContent('No changes were made')
    })

    it('can click update with new changes', async () => {
        const onCloseMock = jest.fn();
        const { getByRole } = render(
            <EditDestination
                id={'1234'}
                city={'TestCity'}
                country={'TestCountry'}
                tags={['Sightseeing', 'City']}
                currentDescription={'City and state in USA'} 
                currentImgUrl={'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/576px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg'}
                onClose={onCloseMock}
            />
        ) 


        const imgUrl = screen.getByLabelText('Image url:');
        fireEvent.change(imgUrl, {
            target: { value: 'https://media.snl.no/media/8057/standard_compressed_NewYork_Chrysler.jpg' }
        })
        
        const climate = screen.getByRole('combobox');
        fireEvent.click(climate);
        fireEvent.change(climate, {target: {value: 'polar'}});

        const newTag = screen.getByLabelText('Beach');
        fireEvent.click(newTag);

        //uncheck a tag
        const cityTag = screen.getByLabelText('City');
        fireEvent.click(cityTag);
        const sightseeingTag = screen.getByLabelText('City');
        fireEvent.click(sightseeingTag);
        
        const button = getByRole('button', {name: 'Update destination'});
        fireEvent.click(button);
        //expect(onCloseMock).toHaveBeenCalled();
        const message = screen.getAllByRole('heading')[1];
        expect(message).toBeInTheDocument();
        expect(message).toHaveTextContent('')
        
    })
    
})