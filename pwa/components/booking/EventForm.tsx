import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RectangleComponent from './AirportSearch'; // Adjust the import path as necessary
import styles from './EventForm.module.css';

const EventForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');

  const [eventData, setEventData] = useState<{ name: string; organization: string; date: string } | null>(null);

  useEffect(() => {
    if (eventId) {
      setEventData({
        name: 'Test Event',
        organization: 'Test Organization',
        date: 'December 25th, 2025 * 10:33am'
      });
    }
  }, [eventId]);

  function handleBackClick() {
    router.back();
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
      <h5>{eventData.organization}</h5>
      <br></br>
      <h3>{eventData.date}</h3>
      <div className={styles.formCard}>
        <RectangleComponent />
      </div>
    </div>
  );
};

export default EventForm;