import React, { useState } from 'react';
import EventForm from './EventForm';
import { useContent } from 'Utils/ContentProvider';
import { useBooking } from 'Utils/BookingProvider';
import NearbyAirports from './NearbyAirports';
import Input from 'Components/common/Input';

const AirportSearch: React.FC = () => {
    const { bookingData, setBookingData } = useBooking();

    const [formData, setFormData] = useState({
        zip: '',
        airport: '',
        trip: 'round-trip',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setBookingData({ event: bookingData.event, content: <NearbyAirports /> });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Airport Search</h2>

            <Input
                label='Zip Code'
                placeholder='Enter your zip code'
                onChange={(value) => setFormData({ ...formData, zip: value })}
            />

            <p>--OR--</p>

            <Input
                label='Airport Code'
                placeholder='Enter the airport code'
                onChange={(value) => setFormData({ ...formData, airport: value })}
            />


            <p>One Way or Round Trip?</p>
            <Input
                isRadio
                name='trip'
                label='One Way'
                onChange={(value) => setFormData({ ...formData, airport: value })}
            />
            <Input
                isRadio
                name='trip'
                label='Round Trip'
                onChange={(value) => setFormData({ ...formData, airport: value })}
            />

            <br /><br />

            <button type="submit">Search</button>
        </form>
    );
};

export default AirportSearch;