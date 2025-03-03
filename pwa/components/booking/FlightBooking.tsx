import React, { useEffect, useState } from 'react';
import { toaster } from 'Components/ui/toaster';
import { useSession } from 'next-auth/react';
import { useBooking } from 'Utils/BookingProvider';
import Input from 'Components/common/Input';
import axios from 'axios';
import styles from './EventForm.module.css';

const FlightBooking = () => {
    const { bookingData, setBookingData } = useBooking();
    const { data: session } = useSession();

    const [formData, setFormData] = useState({
        title: '',
        gender: '',
        birthday: '',
        phoneNumber: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        bookOffer();
    };
    
    const bookOffer = async () => {
        if (!bookingData.selectedOffer) return;

        const params = `${bookingData.selectedOffer.id}/${bookingData.selectedOffer.passengers[0].id}/${formData.title}/${formData.gender}/${session?.user?.email}/${formData.birthday}/${formData.phoneNumber}`;
        axios.get(`/flight_orders/search/${params}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response) => {
            console.log('Booking response:', response.data);
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
        });
    };


    return (
        <form className={styles.bookingForm} onSubmit={handleSubmit}>
            <div className={styles.bookingHeader}>
                <h2>Passenger Information</h2>
                <p>Fill out the form below to book your flight.</p>
            </div>
            <Input
                label='Title'
                onChange={(value) => setFormData({ ...formData, title: value })}
            />
            <Input
                label='Gender'
                onChange={(value) => setFormData({ ...formData, gender: value })}
            />
            <Input
                label='Birthday'
                type='date'
                onChange={(value) => setFormData({ ...formData, birthday: value })}
            />
            <Input
                label='Phone Number'
                type='tel'
                onChange={(value) => setFormData({ ...formData, phoneNumber: value })}
            />
            <button type='submit'>Book Flight</button>
        </form>
    );
};

export default FlightBooking;
