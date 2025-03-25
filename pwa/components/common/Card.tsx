// This file defines a React functional component named `FlightSearch` which is used to display and manage the flight search form for an event.

// The component imports several hooks and components from various libraries to manage state, handle content, and render different parts of the flight search form UI.

// The `useState` hook from React is used to manage local state in the component.
// The `useBooking` hook from a custom `BookingProvider` is used to manage the booking data for the event.
// The `useSession` hook from `next-auth/react` is used to get the current user session data.

// The component imports several utility functions and types from other modules, such as `axios` for making HTTP requests and `DatePicker` for date selection.

// The `SelectOption` interface defines the shape of the options used in the select dropdowns for origin and destination airports.

// The `FlightSearch` component maintains several pieces of state using React's `useState` hook:
// - `formData`: an object that stores the form data, including trip type, origin, destination, departure date, return date, and input values for origin and destination.
// - `startDate` and `endDate`: state variables to manage the selected dates for the date picker.

// The `handleSubmit` function is defined to handle the form submission event. It prevents the default form submission behavior and updates the booking data with the form data, then sets the content to the `FlightResults` component.

// The `debounceTimeout` ref is used to debounce the input for fetching airport options.

// The `fetchAirports` function is an asynchronous function that sends a GET request to the `/places/search/{input}` endpoint with the input value to fetch airport options. 
// If the request is successful, the airport options are formatted and passed to the callback function. If the request fails, an error is logged to the console.

// The `loadOptions` function is defined to debounce the input and call the `fetchAirports` function to load airport options for the select dropdowns.

// The `formatDateDisplay` function is defined to format a date object into a string in the `YYYY-MM-DD` format.

// The `FlightSearch` component returns a JSX structure that represents the flight search form. This structure includes:
// - A select dropdown for trip type (round-trip or one-way).
// - Two async select dropdowns for origin and destination airports, which fetch options based on user input.
// - A date picker for selecting departure and return dates (if round-trip) or only departure date (if one-way).
// - A submit button to search for flights, which calls the `handleSubmit` function when clicked.

// The component uses CSS modules for styling, with classes imported from `EventForm.module.css`.

// Finally, the `FlightSearch` component is exported as the default export of the module.

import React from "react";
import styles from "../dashboard/Dashboard.module.css";
import { Event, formatDateDisplay, formatTime } from "Types/events";
import { Calendar, CircleDollarSign, HandCoins, Plane, PlaneLanding, PlaneTakeoff } from "lucide-react";

// Define types for the Card component props
interface CardProps {
	event: Event;
	buttonText: string;
    isFinance?: boolean;
	onClick: () => void;
}

const Card: React.FC<CardProps> = ({ event, buttonText, isFinance, onClick }) => {
	return (
        <div className={styles.card}>
            <img src={'/media/placeholder-event.jpg'} alt={`Image of ${event.eventTitle}`} className={styles.cardImage} />

            <div className={styles.cardContent}>
                <div>
                    <h3 className={styles.cardTitle}>{event.eventTitle}</h3>
                    <h4 className={`${styles.cardSubtitle} h5`}>{event.organization.name}</h4>
    
                    <div className={styles.cardDetails}>
                        <div className={styles.cardRow}>
                            <Calendar size={16} />
                            {formatDateDisplay(event.startDateTime)} • {formatTime(event.startDateTime)} {event.endDateTime ? `- ${formatTime(event.endDateTime)}` : ''}
                        </div>
        
                        {isFinance ? (
                            <>
                            {/* {event.budget && ( */}
                                <div className={styles.cardRow}>
                                    <HandCoins size={16} />
                                    50000
                                </div>
                            {/* )} */}
                            {/* {event.expenses && ( */}
                                <div className={styles.cardRow}>
                                    <CircleDollarSign size={16} />
                                    6900
                                    {/* Change ^ this back to {events.expenses or budget when weve got it} */}
                                </div>
                            {/* )} */}
                            </>
                        ) : (
                            <>
                            {event.startFlightBooking && buttonText !== "Book Now" && (
                                <div className={styles.cardRow}>
                                    <PlaneTakeoff size={16} />
                                    {formatDateDisplay(event.startFlightBooking)} • {formatTime(event.startFlightBooking)}
                                </div>
                            )}
                            {event.endFlightBooking && buttonText !== "Book Now" && (
                                <div className={styles.cardRow}>
                                    <PlaneLanding size={16} />
                                    {formatDateDisplay(event.endFlightBooking)} • {formatTime(event.endFlightBooking)}
                                </div>
                            )}
                            </>
                        )}
                    </div>
                </div>

                <div className={styles.cardRow}>
                    <button className={styles.cardButton} onClick={onClick}>
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card;
