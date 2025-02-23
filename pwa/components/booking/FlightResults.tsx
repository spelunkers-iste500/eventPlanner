import React, { useEffect, useState } from 'react';
import { useBooking } from 'Utils/BookingProvider';
import Input from 'Components/common/Input';
import { Select } from 'chakra-react-select';
import { Airport, Flight } from 'types/airports';

const AirportSearch: React.FC = () => {
    const { bookingData, setBookingData } = useBooking();

    const handleClick = (flight: Flight) => {
        // proceed with booking
    };

    return (
        <div>

        </div>
    );
};

export default AirportSearch;

const flightResults = [
    
];