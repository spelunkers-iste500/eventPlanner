import React, { useEffect, useState } from 'react';
import RectangleComponent from './AirportSearch'; // Adjust the import path as necessary
import styles from './EventForm.module.css';
import { Event } from 'types/events';
import { useContent } from '@utils/ContentProvider';
import Dashboard from 'components/dashboard/Dashboard';

interface EventData {
  event: Event;
}

const EventForm: React.FC<EventData> = ({ event }) => {
  const [eventData, setEventData] = useState<Event>(event);
  const { setContent } = useContent();

  useEffect(() => { 
    setEventData(event);
  }, [event]);
  

  function handleBackClick() {
    setContent(<Dashboard />, 'Dashboard');
  }

  if (!eventData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <button 
        onClick={handleBackClick} 
        className={styles.backButton}
      >
        Back
      </button>
      <h1>{eventData.name}</h1>
      <h5>{eventData.org}</h5>
      <br></br>
      <h3>{eventData.eventDate}</h3>
      <div className={styles.formCard}>
        <RectangleComponent />
      </div>
    </div>
  );
};

export default EventForm;