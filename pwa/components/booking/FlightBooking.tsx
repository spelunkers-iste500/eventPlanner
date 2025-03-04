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

    const [formData, setFormData] = useState({
        title: '',
        gender: '',
        birthday: '',
        phoneNumber: ''
    });

    const onPrevious = () => {
		setBookingData({ ...bookingData, content: <FlightResults /> });
	}

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
            if (response.status == 200) {
                setContent(<Dashboard />, 'Dashboard');
                toaster.create({
                    title: "Flight Reserved",
                    description: "Your flight has successfully been reserved.",
                    type: "success",
                    duration: 3000,
                    placement: 'top-end'
                });
            }
            
        })
        .catch((error) => {
            console.error('Error fetching flight offers:', error);
        });
    };

    const [startDate, setStartDate] = useState<Date | null>(null);
    
    const formatDate = (date: Date | null) => {
        return date ? date.toISOString().split('T')[0] : '';
    };

    const formatNumber = (number: string) => {
        return number.replace(/\D/g, '');
    }

    return (
        <form className={styles.bookingForm} onSubmit={handleSubmit}>
            <div className={styles.resultsHeader}>
                <button className={`text-btn ${styles.backBtn}`} onClick={onPrevious}><ArrowLeft /> Back</button>
                <div>
                    <h2>Passenger Information</h2>
                    <p>Fill out the form below to book your flight.</p>
                </div>
            </div>
    
            <div className='input-container'>
                <label className='input-label'>Title</label>
                <Select
                    options={[
                        { label: 'Mr', value: 'mr' },
                        { label: 'Ms', value: 'ms' },
                        { label: 'Mrs', value: 'mrs' },
                        { label: 'Miss', value: 'miss' },
                        { label: 'Dr', value: 'dr' },
                    ]}
                    placeholder="Select a title"
                    size="md"
                    isSearchable={false}
                    className={`select-menu ${styles.tripType}`}
                    classNamePrefix={'select'}
                    onChange={(option) => setFormData({ ...formData, title: option?.value || '' })}
                />
            </div>
            
            <div className='input-container'>
                <label className='input-label'>Gender</label>
                <Select
                    options={[
                        { label: 'Male', value: 'm' },
                        { label: 'Female', value: 'f' },
                    ]}
                    placeholder="Select a title"
                    size="md"
                    isSearchable={false}
                    className={`select-menu ${styles.tripType}`}
                    classNamePrefix={'select'}
                    onChange={(option) => setFormData({ ...formData, gender: option?.value || '' })}
                />
            </div>

            <Input
                label='Phone Number'
                type='tel'
                isPhoneNumber
                placeholder='Enter your phone number'
                onChange={(value) => setFormData({ ...formData, phoneNumber: value })}
            />

            <div className='input-container'>
                <label className='input-label'>Birthday</label>
                <DatePicker
                    selected={startDate}
                    startDate={startDate}
                    maxDate={new Date()}
                    onChange={(date) => {
                        setStartDate(date);
                        setFormData({ ...formData, birthday: formatDate(date)})}
                    }
                    openToDate={new Date("2000/01/01")}
                    showMonthDropdown
                    showYearDropdown
                    placeholderText="Enter your birthday"
                    dateFormat="MM/dd/yyyy"
                    className='input-field'
                    showIcon
                    icon={<Calendar size={32} />}
                />
            </div>
            <button type='submit'>Book Flight</button>
        </form>
    );
};

export default FlightBooking;
