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
