// This file defines a React functional component named `FlightResults` which is used to display and manage the flight search results for an event.

// The component imports several hooks and components from various libraries to manage state, handle content, and render different parts of the flight search results UI.

// The `useEffect` and `useState` hooks from React are used to perform side effects and manage local state in the component.
// The `useSession` hook from `next-auth/react` is used to get the current user session data.
// The `useBooking` hook from a custom `BookingProvider` is used to manage the booking data for the event.

// The component imports several utility functions and types from other modules, such as `axios` for making HTTP requests and `date-fns` for date formatting.

// The `FlightResults` component maintains several pieces of state using React's `useState` hook:
// - `flightResults`: an array of flight offers fetched from the server.
// - `loading`: a boolean that indicates whether the flight offers are being loaded.
// - `currentPage`: a number that tracks the current page of results being displayed.

// The `useEffect` hook is used to fetch flight offers from the server when the component mounts or when the `bookingData` changes. 
// The flight offers are fetched by sending a POST request to the `/flight_offers` endpoint with the search parameters. 
// If the request is successful, the flight offers are stored in the `flightResults` state and the `loading` state is set to false. 
// If the request fails, an error is logged to the console.

// The `handleClick` function is defined to handle the click event on a flight offer. It sets the selected offer in the booking data and updates the content to the `FlightBooking` component.

// The `onPrevious` function is defined to handle the back button click event. It sets the content to the `FlightSearch` component.

// The `showMoreResults` function is defined to handle the click event on the "Show More" button. It increments the `currentPage` state to display more results.

// The `formatDuration` function is defined to format the flight duration string into a more readable format.

// The `FlightResults` component returns a JSX structure that represents the flight search results. This structure includes:
// - A header section with a back button and a heading displaying the number of results.
// - A section displaying the flight results, which includes a list of flight offers. Each offer displays the flight details, including the departure and arrival times, route, duration, price, and airline name.
// - A "Show More" button to display more results if there are more results available.

// The component uses CSS modules for styling, with classes imported from `EventForm.module.css`.

// Finally, the `FlightResults` component is exported as the default export of the module.

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
import { useSession } from 'next-auth/react';
const FlightResults: React.FC = () => {
    const { bookingData, setBookingData } = useBooking();
    const [ flightResults, setFlightResults ] = useState<Offer[]>([]);
    const [ loading, setLoading ] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 10;
    const { data: session } = useSession();
    if (!session) {
        return null;
    }

    useEffect(() => {
        const fetchFlightOffers = async () => {
            axios.post(`/flight_offers`, {
                origin: bookingData.originAirport,
                destination: bookingData.destinationAirport,
                departureDate: bookingData.departDate,
                returnDate: (bookingData.isRoundTrip) ? bookingData.returnDate : null,
                maxConnections: 1,
            }, {
                headers: {
                    'Content-Type': 'application/ld+json',
                    'accept': 'application/ld+json',
                    'Authorization': `Bearer ${session.apiToken}`
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