import React, { useEffect, useRef, useState } from 'react';
import { useBooking } from 'Utils/BookingProvider';
import Input from 'Components/common/Input';
import { Select } from 'chakra-react-select';
import { Airport } from 'types/airports';
import FlightResults from './FlightResults';
import styles from './EventForm.module.css';

const AirportSearch: React.FC = () => {
    const { bookingData, setBookingData } = useBooking();

    const [formData, setFormData] = useState({
        trip: 'round-trip',
        origin: '',
        destination: '',
        departDate: '',
        returnDate: '',
        originInput: '',
        destinationInput: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // make request to API to fetch relevant flight results and switch to results page
        setBookingData({
            ...bookingData,
            isRoundTrip: formData.trip === 'round-trip',
            departAirport: formData.origin,
            returnAirport: formData.destination,
            departDate: formData.departDate,
            returnDate: formData.returnDate,
            content: <FlightResults />
        });
    };
    
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            if (formData.originInput.length >= 3) {
                console.log('Fetching origin airports for:', formData.originInput);
                // fetch list of airports using formData.originInput
                // setAirportLocations(airports);
            }
            if (formData.destinationInput.length >= 3) {
                console.log('Fetching destination airports for:', formData.destinationInput);
                // fetch list of airports using formData.destinationInput
                // setAirportLocations(airports);
            }
        }, 1000);

        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [formData.originInput, formData.destinationInput]); 

    return (
        <form className={styles.flightSearchForm} onSubmit={handleSubmit}>
            <div className='input-container'>
                <label className='input-label'>Trip Type</label>
                <Select
                    options={[
                        { label: 'Round Trip', value: 'round-trip' },
                        { label: 'One Way', value: 'one-way' }
                    ]}
                    placeholder="Trip Type"
                    size="md"
                    isSearchable={false}
                    defaultValue={{ label: 'Round Trip', value: 'round-trip' }}
                    className={`select-menu ${styles.selectMenu}`}
                    classNamePrefix={'select'}
                    onChange={(option) => setFormData({ ...formData, trip: option?.value || 'round-trip' })}
                />
            </div>

            <div className='input-container'>
                <label className='input-label'>Origin</label>
                <Select
                    options={airportLocations}
                    placeholder="Where From?"
                    size="md"
                    className={`select-menu ${styles.selectMenu}`}
                    classNamePrefix={'select'}
                    onChange={(value) => setFormData({ ...formData, origin: value?.value || '' })}
                    onInputChange={(inputValue) => setFormData({ ...formData, originInput: inputValue })}
                />
            </div>

            <div className='input-container'>
                <label className='input-label'>Destination</label>
                <Select
                    options={airportLocations}
                    placeholder="Where to?"
                    size="md"
                    className={`select-menu ${styles.selectMenu}`}
                    classNamePrefix={'select'}
                    onChange={(value) => setFormData({ ...formData, destination: value?.value || '' })}
                    onInputChange={(inputValue) => setFormData({ ...formData, destinationInput: inputValue })}
                />
            </div>

            <Input
                type='date'
                label='Departure Date'
                placeholder='mm/dd/yyyy'
                onChange={(value) => setFormData({ ...formData, departDate: value })}
            />
            
            {formData.trip === 'round-trip' && (
                <Input
                    type='date'
                    label='Return Date'
                    placeholder='mm/dd/yyyy'
                    onChange={(value) => setFormData({ ...formData, returnDate: value })}
                />
            )}

            <button type="submit">Search</button>
        </form>
    );
};

export default AirportSearch;

const airportLocations = [
    { label: 'Atlanta, GA (ATL)', value: 'ATL' },
    { label: 'Chicago, IL (ORD)', value: 'ORD' },
    { label: 'Dallas, TX (DFW)', value: 'DFW' },
    { label: 'Denver, CO (DEN)', value: 'DEN' },
    { label: 'Los Angeles, CA (LAX)', value: 'LAX' },
    { label: 'New York, NY (JFK)', value: 'JFK' },
    { label: 'Orlando, FL (MCO)', value: 'MCO' },
    { label: 'San Francisco, CA (SFO)', value: 'SFO' },
    { label: 'Seattle, WA (SEA)', value: 'SEA' }
];