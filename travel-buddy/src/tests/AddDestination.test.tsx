import AddDestination from '../components/AddDestination';
import React from 'react';
import { act, fireEvent, getByLabelText, getByTestId, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'; 


describe('AddDestination allows', () => {
    beforeEach(() => {
        const {getByRole} = render(<AddDestination/>);
    })
    it('writing in textfields', () => {
        const listTextfields: string[] = ['City:', 'Country:', 'Image url:']
        listTextfields.map((text) => {
            const textfield = screen.getByLabelText(text);
            fireEvent.change(textfield, {
                target: { value: 'test' }
            })
            expect(textfield).toHaveValue('test');
        })
    })
    
    test('selecting continent and climate in combobox', () => {
        const continent = screen.getAllByRole('combobox')[0];
        act(() => {
            fireEvent.click(continent);
        })
        fireEvent.change(continent, { target: { value: 'europe' } });
        expect(continent).toHaveValue('europe')

        const climate = screen.getAllByRole('combobox')[1]
        act(() => {
            fireEvent.click(climate);
        })
        fireEvent.change(climate, {target: {value: 'polar'}})
        expect(climate).toHaveValue('polar');
    })

    test('seeing all the options in comboboxes', () => {
        const climateOptions: string[] = ['Polar', 'Continental', 'Temperate', 'Dry', 'Tropical',];
        climateOptions.map((op) => {
            const climateOption = screen.getByRole('option', {name: op})
            expect(climateOption).toBeInTheDocument();
        })
    })

    test('selecting and unselecting checkboxes', () => {
        const listCheckboxes: string[] = [
            "Hiking", "Skiing", "Sightseeing", "City",
            "Beach", "Culture", "Safari", "Historical", "Active"
        ]
        listCheckboxes.map((box) => {
            const checkBox = screen.getByLabelText(box)
            act(() => {
                fireEvent.click(checkBox)
            })
            expect(checkBox).toBeChecked;

            act(() => {
                fireEvent.click(checkBox)
            })
            !expect(checkBox).toBeChecked;
        })

    })

    it('writing in textarea', () => {
        const textarea = screen.getAllByRole('textbox').slice(-1)[0] ;
        fireEvent.change(textarea, {
            target: { value: 'A travel destination' }
        })
        expect(textarea).toHaveValue('A travel destination');
    })
})

describe('Clicking add new destination', () => {
    it('is not allowed when fields are empty', () => {
        const onCloseMock = jest.fn();
        const {getByRole} = render(<AddDestination onClose={onCloseMock}/>);
        const button = screen.getByRole('button', {name: 'Add new destination'})
        act(() => {
            fireEvent.click(button);
        })
        const message = screen.getByRole('heading', {name: 'Fill inn all fields'});
        expect(message).toBeInTheDocument();
        expect(message).toHaveTextContent('Fill inn all fields')
        expect(onCloseMock).not.toHaveBeenCalled();
    })
    
    it('is allowed when the fields are filled in', async () => {
        const onCloseMock = jest.fn();
        const {getByRole} = render(<AddDestination onClose={onCloseMock}/>);
        const button = screen.getByRole('button', {name: 'Add new destination'})
        const listTextfields: string[] = ['City:', 'Country:', 'Image url:']
        listTextfields.map((text) => {
            const textfield = screen.getByLabelText(text);
            fireEvent.change(textfield, {
                target: { value: 'test' }
            })
        })
        const continent = screen.getAllByRole('combobox')[0];
        const climate = screen.getAllByRole('combobox')[1]
        act(() => {
            fireEvent.click(continent);
            fireEvent.click(climate);
        })
        fireEvent.change(continent, { target: { value: 'europe' } });
        fireEvent.change(climate, {target: {value: 'polar'}})
        act(() => {
            fireEvent.click(button);
        })
        const message = screen.getAllByRole('heading')[1];
        expect(message).toHaveTextContent('');
    })
})

