import React, { useEffect, useState } from 'react';
import { useBooking } from 'Utils/BookingProvider';
import { Spinner } from '@chakra-ui/react';
import { Flight, Offer, Passenger, Segment, Slice } from 'types/airports';
import FlightSearch from './FlightSearch';
import axios from 'axios';
import styles from './EventForm.module.css';
import { ArrowLeft } from 'lucide-react';

const FlightResults: React.FC = () => {
    const { bookingData, setBookingData } = useBooking();
    const [ flightResults, setFlightResults ] = useState<Offer[]>([]);
    const [ loading, setLoading ] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 10;

    useEffect(() => {
        const fetchFlightOffers = async () => {
            let params = `${bookingData.destinationAirport}/${bookingData.originAirport}/${bookingData.departDate}`;
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
            <div className={styles.resultsHeader}>
                <button className={`text-btn ${styles.backBtn}`} onClick={onPrevious}><ArrowLeft /> Back</button>
                <div>
                    <h2>Flight Results</h2>
                    {!loading ? <p>Displaying {displayedResults.length} of {flightResults.length} Results</p> : ''}
                </div>
            </div>

            <div className={`${styles.flightResults}`}>
                {loading ? <Spinner size="xl" color='var(--blue-500)' /> : (
                    <>
                        {displayedResults.map((offer: Offer, index: number) => (
                            <div className={styles.resultCard} key={index} onClick={() => handleClick(offer)}>
                                <h3 className={styles.resultTitle}>{offer.owner.name}</h3>
                                <img src={offer.owner.logo_symbol_url} alt={`${offer.owner.name} logo`} />
                                <p>Price before tax: ${offer.base_amount}</p>
                                <p>Price after tax: ${offer.total_amount}</p>
                                <p>Passenger ID: {offer.passengers[0].id}</p>
                                {offer.slices.map((slice: Slice, sliceIndex: number) => (
                                    <div key={sliceIndex}>
                                        <h4>{sliceIndex === 0 ? 'Departing Flight' : 'Returning Flight'}</h4>
                                        <p>Origin: {slice.origin.iata_code}</p>
                                        <p>Destination: {slice.destination.iata_code}</p>
                                        {slice.segments.map((segment: Segment, segmentIndex: number) => (
                                            <div key={segmentIndex}>
                                                <h5>Flight Details</h5>
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