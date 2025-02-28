import React, { useEffect, useState } from 'react';
import { useBooking } from 'Utils/BookingProvider';
import { Spinner } from '@chakra-ui/react';
import { Flight, Offer, Passenger, Segment, Slice } from 'types/airports';
import FlightSearch from './FlightSearch';
import axios from 'axios';
import styles from './EventForm.module.css';

const FlightResults: React.FC = () => {
    const { bookingData, setBookingData } = useBooking();
    const [ flightResults, setFlightResults ] = useState<Offer[]>([]);
    const [ loading, setLoading ] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 10;

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
                setFlightResults(response.data.offers);
                console.log('Flight offers:', response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching flight offers:', error);
            });
        };


        fetchFlightOffers();
    }, [bookingData]);

    const handleClick = (flight: Offer) => {
        // proceed with booking
    };

    const onPrevious = () => {
		setBookingData({ ...bookingData, content: <FlightSearch /> });
	}

    const showMoreResults = () => {
        setCurrentPage(currentPage + 1);
    };

    const displayedResults = flightResults.slice(0, currentPage * resultsPerPage);

    return (
        <div>
            <button onClick={onPrevious}>Back</button>
            <h2>Flight Results</h2>
            {!loading ? <p>Displaying {displayedResults.length} of {flightResults.length} Results</p> : ''}

            <div className={`${styles.flightResults}`}>
                {loading ? <Spinner size="xl" color='var(--blue-500)' /> : (
                    <>
                        {displayedResults.map((offer: Offer, index: number) => (
                            <div key={index} onClick={() => handleClick(offer)}>
                                <h3>{offer.owner.name} Flight {offer.id}</h3>
                                {/* <img src={offer.owner.logo_symbol_url} alt={`${offer.owner.name} logo`} /> */}
                                <p>Price before tax: ${offer.base_amount}</p>
                                <p>Price after tax: ${offer.total_amount}</p>
                                <p>Passenger ID: {offer.passengers.map((passenger: Passenger) => passenger.id).join(', ')}</p>
                                {offer.slices.map((slice: Slice, sliceIndex: number) => (
                                    <div key={sliceIndex}>
                                        <h4>Slice {sliceIndex + 1}</h4>
                                        <p>Origin: {slice.origin.iata_code}</p>
                                        <p>Destination: {slice.destination.iata_code}</p>
                                        {slice.segments.map((segment: Segment, segmentIndex: number) => (
                                            <div key={segmentIndex}>
                                                <p>Segment {segmentIndex + 1}</p>
                                                <p>Departure Date: {segment.departing_at}</p>
                                                <p>Arrival Date: {segment.arriving_at}</p>
                                                <p>Duration: {segment.duration}</p>
                                                <p>Origin: {segment.origin.iata_code}</p>
                                                <p>Destination: {segment.destination.iata_code}</p>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                        {currentPage * resultsPerPage < flightResults.length && (
                            <button onClick={showMoreResults}>Show More</button>
                        )}
                    </>
                )}
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