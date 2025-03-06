import React, { useEffect } from 'react';
import styles from './EventForm.module.css';
import { Event, formatDate, formatTime } from 'Types/events';
import { useContent } from 'Utils/ContentProvider';
import Dashboard from 'Components/dashboard/Dashboard';
import { useBooking } from 'Utils/BookingProvider';
import { X } from 'lucide-react';
import FlightSearch from './FlightSearch';

interface EventData {
  	eventData: Event;
}

const EventForm: React.FC<EventData> = ({ eventData }) => {
    const { setContent } = useContent();
	const { bookingData, setBookingData } = useBooking();

    useEffect(() => {
        setBookingData({ event: eventData, content: <FlightSearch /> });
    }, [eventData, setBookingData]);
    

    function handleBackClick() {
      	setContent(<Dashboard />, 'Dashboard');
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
				<h2 className='h4'>{bookingData.event.organization}</h2>
				<p>{formatDate(bookingData.event.startDateTime)} • {formatTime(bookingData.event.startDateTime)} {bookingData.event.endDateTime ? `- ${formatTime(bookingData.event.endDateTime)}` : ''}</p>
			</div>

			<div className={styles.formCard}>
				{bookingData.content}
			</div>
		</div>
    );
};

export default EventForm;