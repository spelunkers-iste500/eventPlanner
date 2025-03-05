import React, { useEffect, useState } from 'react';
import { useBooking } from 'Utils/BookingProvider';
import { Spinner } from '@chakra-ui/react';
import { Offer, Segment, Slice } from 'types/airports';
import { ArrowLeft, MoveRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import axios from 'axios';
import FlightSearch from './FlightSearch';
import FlightBooking from './FlightBooking';
import styles from './EventForm.module.css';

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

            axios.get(`/flight_offers/search/${params}/${bookingData.maxConnections}?page=1`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => {
                setFlightResults(response.data.offers);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching flight offers:', error);
            });
        };

        fetchFlightOffers();
    }, [bookingData]);

    const handleClick = (offer: Offer) => {
        setBookingData({ ...bookingData, selectedOffer: offer, content: <FlightBooking /> });
    };

    const onPrevious = () => {
		setBookingData({ ...bookingData, content: <FlightSearch /> });
	}

    const showMoreResults = () => {
        setCurrentPage(currentPage + 1);
    };

    const formatDuration = (duration: string) => {
        const match = duration.match(/PT(\d+H)?(\d+M)?/);
        const hours = match && match[1] ? match[1].replace('H', 'h ') : '';
        const minutes = match && match[2] ? match[2].replace('M', 'm') : '';
        return `${hours}${minutes}`.trim();
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
                {loading ? <Spinner size="xl" className={styles.spinner} color='var(--blue-500)' /> : (
                    <>
                        {displayedResults.map((offer: Offer, index: number) => (
                            <div className={styles.resultCard} key={index} onClick={() => handleClick(offer)}>
                                
                                <img className={styles.airlinerLogo} src={offer.owner.logo_symbol_url} alt={`${offer.owner.name} logo`} />
                                <div className={styles.flightDetailsWrapper}>
                                    <div className={styles.flightDetails}>
                                        <div className={styles.flightInfo}>
                                        {offer.slices.map((slice: Slice, sliceIndex: number) => (
                                                <>
                                                {slice.segments.map((segment: Segment, segmentIndex: number) => {
                                                    const departureDate = parseISO(segment.departing_at);
                                                    const arrivalDate = parseISO(segment.arriving_at);
                                                    const fArrivalTime = format(arrivalDate, 'p');
                                                    const fDepartDate = format(departureDate, 'MM/dd');
                                                    const fDepartTime = format(departureDate, 'p');
                                                    const fDuration = formatDuration(segment.duration);
                                                    
                                                    return (
                                                        <div key={segmentIndex}>
                                                            <h3 className='h5'>{sliceIndex === 0 ? 'Departing' : 'Returning'} {fDepartDate}</h3>
                                                            <div className={styles.flightTime}>
                                                                <p>{fDepartTime}</p>
                                                                <span className={styles.timeDivider}></span>
                                                                <p>{fArrivalTime}</p>
                                                            </div>
                                                            <div className={styles.flightRoute}>
                                                                <p>{segment.origin.iata_code}</p>
                                                                <MoveRight />
                                                                <p>{segment.destination.iata_code}</p>
                                                                <p>• {fDuration}</p>
                                                            </div>
                                                            
                                                        </div>
                                                    );
                                                })}
                                                </>
                                            ))}
                                        </div>
                                        <div className={styles.flightPriceInfo}>
                                            <p className={styles.flightPrice}>${offer.total_amount}</p>
                                            <p className={styles.flightClass}>{offer.slices[0].segments[0].passengers[0].cabin_class_marketing_name}</p>
                                        </div>
                                    </div>
                                    <p className={styles.airliner}>{offer.owner.name}</p>
                                </div>
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