import React, { useEffect, useState } from 'react';
import { useBooking } from 'Utils/BookingProvider';
import Input from 'Components/common/Input';
import { Select } from 'chakra-react-select';
import { Airport } from 'types/airports';

const AirportSearch: React.FC = () => {
    const { bookingData, setBookingData } = useBooking();

    const [formData, setFormData] = useState({
        trip: 'round-trip',
        origin: { label: '', value: '' },
        destination: '',
        departDate: '',
        returnDate: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // make request to API to fetch relevant flight results and switch to results page
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Flight Search</h2>

            <Select
                options={[
                    { label: 'Round Trip', value: 'round-trip' },
                    { label: 'One Way', value: 'one-way' }
                ]}
                placeholder="Trip Type"
                size="md"
                isSearchable={false}
                defaultValue={{ label: 'Round Trip', value: 'round-trip' }}
                className='select-menu'
                onChange={(option) => setFormData({ ...formData, trip: option?.value || 'round-trip' })}
            />

            <Select
                options={airportLocations}
                placeholder="Where From?"
                size="md"
                className='select-menu'
                onChange={(option) => setFormData({ ...formData, origin: option || { label: '', value: '' } })}
            />

            <Select
                options={airportLocations}
                placeholder="Where to?"
                size="md"
                className='select-menu'
                onChange={(value) => setFormData({ ...formData, destination: value?.value || '' })}
            />

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
    { label: 'Atlanta, GA', value: 'ATL' },
    { label: 'Chicago, IL', value: 'ORD' },
    { label: 'Dallas, TX', value: 'DFW' },
    { label: 'Denver, CO', value: 'DEN' },
    { label: 'Los Angeles, CA', value: 'LAX' },
    { label: 'New York, NY', value: 'JFK' },
    { label: 'Orlando, FL', value: 'MCO' },
    { label: 'San Francisco, CA', value: 'SFO' },
    { label: 'Seattle, WA', value: 'SEA' }
];