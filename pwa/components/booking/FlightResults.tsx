import React, { useEffect, useState } from 'react';
import { useBooking } from 'Utils/BookingProvider';
import { Flight } from 'types/airports';
import FlightSearch from './FlightSearch';
import axios from 'axios';

const AirportSearch: React.FC = () => {
    const { bookingData, setBookingData } = useBooking();
    const [ flightResults, setFlightResults ] = useState<Flight[]>([]);

    useEffect(() => {
        // fetch airports from API using bookingData props
        //use axios to get the data
        axios.get('/api/airports', {
            params: {
                origin: bookingData.departAirport,
                destination: bookingData.returnAirport,
                departDate: bookingData.departDate,
                returnDate: bookingData.returnDate
            }
        })
        .then(response => {
            setFlightResults(response.data);
        })
        .catch(error => {
            console.error('Error fetching flight results:', error);
        });

        setFlightResults(results);
    }, []);

    const handleClick = (flight: Flight) => {
        // proceed with booking
    };

    const onPrevious = () => {
		setBookingData({ ...bookingData, content: <FlightSearch /> });
	}

    return (
        <div>
            <button onClick={onPrevious}>Back</button>
            <h2>Flight Results</h2>
            <p>{flightResults.length} Results</p>

            <div>
                {flightResults.map((flight, index) => (
                    <div key={index} onClick={() => handleClick(flight)}>
                        <h3>{flight.airline} Flight {flight.flightNumber}</h3>
                        <p>Date: {flight.date}</p>
                        <p>Time: {flight.time}</p>
                        <p>Price: ${flight.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AirportSearch;

const results = [
    {
        airline: 'United',
        flightNumber: '1240',
        date: 'Dec 4, 2024',
        time: '4pm',
        price: 320
    },
    {
        airline: 'Jet Blue',
        flightNumber: '3570',
        date: 'Dec 4, 2024',
        time: '4pm',
        price: 334
    },
    {
        airline: 'Delta',
        flightNumber: '1287',
        date: 'Dec 4, 2024',
        time: '6pm',
        price: 349
    }
];