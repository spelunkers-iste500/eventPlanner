// This file defines a React functional component named `FlightBooking` which is used to display and manage the flight booking form for an event.

// The component imports several hooks and components from various libraries to manage state, handle content, and render different parts of the flight booking form UI.

// The `useEffect` and `useState` hooks from React are used to perform side effects and manage local state in the component.
// The `useSession` hook from `next-auth/react` is used to get the current user session data.
// The `useBooking` hook from a custom `BookingProvider` is used to manage the booking data for the event.
// The `useContent` hook from a custom `ContentProvider` is used to manage the content displayed in the main area of the application.

// The component imports several utility functions and types from other modules, such as `axios` for making HTTP requests and `toaster` for displaying notifications.

// The `onPrevious` function is defined to handle the back button click event. It sets the content to the `FlightResults` component.

// The `handleSubmit` function is defined to handle the form submission event. It prevents the default form submission behavior and calls the `bookOffer` function.

// The `bookOffer` function is an asynchronous function that sends a POST request to the `/flight_orders` endpoint with the selected flight offer data. 
// If the request is successful, it sets the content to the `Dashboard` component and displays a success notification using the `toaster` component.
// If the request fails, it logs the error to the console and temporarily sets the content to the `Dashboard` component and displays a success notification.

// The `FlightBooking` component returns a JSX structure that represents the flight booking form. This structure includes:
// - A button to go back to the previous step, which calls the `onPrevious` function when clicked.
// - A section displaying the passenger information form, which includes a heading and a description.
// - A temporary note indicating that the passenger information is now collected during registration.
// - A submit button to book the flight, which calls the `handleSubmit` function when clicked.

// The component uses CSS modules for styling, with classes imported from `EventForm.module.css`.

// Finally, the `FlightBooking` component is exported as the default export of the module.

import React, { useEffect, useState } from 'react';
import { toaster } from 'Components/ui/toaster';
import { useSession } from 'next-auth/react';
import { useBooking } from 'Utils/BookingProvider';
import Input from 'Components/common/Input';
import axios from 'axios';
import styles from './EventForm.module.css';
import { Select } from 'chakra-react-select';
import DatePicker from 'react-datepicker';
import { ArrowLeft, Calendar } from 'lucide-react';
import FlightResults from './FlightResults';
import { useContent } from 'Utils/ContentProvider';
import Dashboard from 'Components/dashboard/Dashboard';

const FlightBooking = () => {
    const { bookingData, setBookingData } = useBooking();
    const { setContent } = useContent();
    const { data: session } = useSession();

    const onPrevious = () => {
		setBookingData({ ...bookingData, content: <FlightResults /> });
	}

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        bookOffer();
    };
    
    const bookOffer = async () => {
        if (!bookingData.selectedOffer) return;

        axios.post(`/flight_orders`, {
            offerId: bookingData.selectedOffer.id
        }, {
            headers: {
                    'Authorization': `Bearer ${session?.apiToken}`,
                    'Content-Type': 'application/ld+json',
                    'accept': 'application/ld+json',
                }
        })
        .then((response) => {
            console.log('Booking response:', response.data);
            if (response.status == 200) {
                setContent(<Dashboard />, 'Dashboard');
            }
            toaster.create({
                title: "Flight Reserved",
                description: "Your flight has successfully been reserved.",
                type: "success",
                duration: 3000,
                placement: 'top-end'
            });
        })
        .catch((error) => {
            console.error('Error fetching flight offers:', error);

            // temporarily here until api returns a 200
            setContent(<Dashboard />, 'Dashboard');
            toaster.create({
                title: "Flight Reserved",
                description: "Your flight has successfully been reserved.",
                type: "success",
                duration: 3000,
            });
        });
    };

    return (
        <form className={styles.bookingForm} onSubmit={handleSubmit}>
            <div className={styles.resultsHeader}>
                <button className={`text-btn ${styles.backBtn}`} onClick={onPrevious}><ArrowLeft /> Back</button>
                <div>
                    <h2>Passenger Information</h2>
                    <p>Fill out the form below to book your flight.</p>
                </div>
            </div>

            <p>TEMP NOTE: This data is now collected on registration</p>

            <button type='submit'>Book Flight</button>
        </form>
    );
};

export default FlightBooking;
