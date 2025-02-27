import React, { useEffect, useState } from 'react';
import { useBooking } from 'Utils/BookingProvider';
import { Flight } from 'types/airports';
import FlightSearch from './FlightSearch';
import axios from 'axios';

const FlightResults: React.FC = () => {
    const { bookingData, setBookingData } = useBooking();
    const [ flightResults, setFlightResults ] = useState<Flight[]>([]);

    useEffect(() => {
        const fetchFlightOffers = async () => {
            let params = `${bookingData.originAirport}/${bookingData.destinationAirport}/${bookingData.departDate}`;
            if (bookingData.isRoundTrip) {
                params += `/${bookingData.returnDate}`;
            }

            axios.get(`/flight_offers/search/${params}/${bookingData.maxConnections}`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => {
                setFlightResults(response.data);
                console.log('Flight offers:', response.data);
            })
            .catch((error) => {
                console.error('Error fetching flight offers:', error);
            });
        };


        fetchFlightOffers();
    }, [bookingData]);

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
                {/* {flightResults.map((flight, index) => (
                    <div key={index} onClick={() => handleClick(flight)}>
                        <h3>{flight.airline} Flight {flight.flightNumber}</h3>
                        <p>Date: {flight.date}</p>
                        <p>Time: {flight.time}</p>
                        <p>Price: ${flight.price}</p>
                    </div>
                ))} */}
            </div>
        </div>
    );
};

export default FlightResults;

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