// This file defines a React functional component named `EventForm` which is used to display and manage the booking form for an event.

// The component imports several hooks and components from various libraries to manage state, handle content, and render different parts of the booking form UI.

// The `useEffect` hook from React is used to perform side effects in the component, such as setting the booking data when the component mounts or when the `eventData` prop changes.

// The `useContent` hook from a custom `ContentProvider` is used to manage the content displayed in the main area of the application.
// The `useBooking` hook from a custom `BookingProvider` is used to manage the booking data for the event.

// The component imports several utility functions and types from other modules, such as `formatDateDisplay` and `formatTime` from `Types/events` to format the event date and time.

// The `EventData` interface defines the shape of the `eventData` prop that the `EventForm` component expects. It includes an `eventData` object of type `Event`.

// The `EventForm` component takes an `eventData` prop and uses it to set the booking data, including the event details and the content to be displayed in the form (a `FlightSearch` component).

// The `handleBackClick` function is defined to handle the back button click event. It sets the content to the `Dashboard` component.

// If the `bookingData.event` is not available, the component renders a loading message.

// The `EventForm` component returns a JSX structure that represents the booking form. This structure includes:
// - A button to go back to the home page, which calls the `handleBackClick` function when clicked.
// - A section displaying the event information, including the event title, organization, date, and time.
// - A section displaying the booking form content, which is set to the `FlightSearch` component.

// The component uses CSS modules for styling, with classes imported from `EventForm.module.css`.

// Finally, the `EventForm` component is exported as the default export of the module.

import React, { useEffect } from 'react';
import styles from './EventForm.module.css';
import { UserEvent, formatDateDisplay, formatTime } from 'Types/events';
import { useContent } from 'Utils/ContentProvider';
import Dashboard from 'Components/dashboard/Dashboard';
import { BookingData, useBooking } from 'Utils/BookingProvider';
import { X } from 'lucide-react';
import FlightSearch from './FlightSearch';

interface EventData {
  	eventData: UserEvent;
}

const EventForm: React.FC<EventData> = ({ eventData }) => {
    const { setContent } = useContent();
	const { bookingData, setBookingData } = useBooking();

    useEffect(() => {
        setBookingData({ event: eventData.event, userEventId: eventData.id, content: <FlightSearch /> });
    }, [eventData, setBookingData]);
    

    function handleBackClick() {
      	setContent(<Dashboard />, 'Dashboard');
		setBookingData({} as BookingData);
    }

    if (!bookingData.event) {
      	return <div>Loading...</div>;
    }

    return (
		<div className={styles.container}>
			<button 
				onClick={handleBackClick} 
				className={`text-btn ${styles.backHome}`}
			>
				Back Home <X />
			</button>

			<div className={styles.eventInfo}>
				<h1>{bookingData.event.eventTitle}</h1>
				<h2 className='h4'>{bookingData.event.organization.name}</h2>
				<p>{formatDateDisplay(bookingData.event.startDateTime)} • {formatTime(bookingData.event.startDateTime)} {bookingData.event.endDateTime ? `- ${formatTime(bookingData.event.endDateTime)}` : ''}</p>
				{bookingData.event.budget && <p>Allowed Budget: ${bookingData.event.budget.perUserTotal}</p>}
			</div>

			<div className={styles.formCard}>
				{bookingData.content}
			</div>
		</div>
    );
};

export default EventForm;