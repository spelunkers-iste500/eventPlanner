import React, { useEffect, useRef, useState } from 'react';
import { useBooking } from 'Utils/BookingProvider';
import Input from 'Components/common/Input';
import { AsyncSelect, Select } from 'chakra-react-select';
import { Airport } from 'types/airports';
import FlightResults from './FlightResults';
import styles from './EventForm.module.css';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';

interface SelectOption {
    label: string;
    value: string;
}

const FlightSearch: React.FC = () => {
    const { bookingData, setBookingData } = useBooking();

    const [formData, setFormData] = useState({
        trip: 'round-trip',
        origin: '',
        destination: '',
        departDate: '',
        returnDate: '',
        originInput: '',
        destinationInput: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setBookingData({
            ...bookingData,
            isRoundTrip: formData.trip === 'round-trip',
            originAirport: formData.origin,
            destinationAirport: formData.destination,
            departDate: formData.departDate,
            returnDate: formData.returnDate,
            maxConnections: 1,
            content: <FlightResults />
        });
    };
    
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const fetchAirports = async (input: string, callback: (options: SelectOption[]) => void) => {
        try {
            const response = await axios.get(`/places/search/${input}`);
            const airports = response.data['hydra:member'].map((airport: any) => ({
                label: `${airport.name} (${airport.iataCode})`,
                value: airport.iataCode
            }));
            console.log('Airports:', airports);
            callback(airports);
        } catch (error) {
            console.error('Error fetching airports:', error);
            callback([]);
        }
    };

    const loadOptions = (inputValue: string, callback: (options: SelectOption[]) => void) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            if (inputValue.length >= 3) {
                fetchAirports(inputValue, callback);
            } else {
                callback([]);
            }
        }, 1000);
    };

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const formatDate = (date: Date | null) => {
        return date ? date.toISOString().split('T')[0] : '';
    };

    return (
        <form className={styles.flightSearchForm} onSubmit={handleSubmit}>
            <div className='input-container'>
                <label className='input-label'>Trip Type</label>
                <Select
                    options={[
                        { label: 'Round Trip', value: 'round-trip' },
                        { label: 'One Way', value: 'one-way' }
                    ]}
                    placeholder="Trip Type"
                    size="md"
                    isSearchable={false}
                    defaultValue={{ label: 'Round Trip', value: 'round-trip' }}
                    className={`select-menu ${styles.tripType}`}
                    classNamePrefix={'select'}
                    onChange={(option) => setFormData({ ...formData, trip: option?.value || 'round-trip' })}
                />
            </div>

            <div className={styles.originDestination}>
                <div className='input-container'>
                    <label className='input-label'>Origin</label>
                    <AsyncSelect
                        loadOptions={loadOptions}
                        noOptionsMessage={() => formData.originInput.length < 3 ? 'Start typing to search' : 'No airports found'}
                        placeholder="Where from?"
                        size="md"
                        className={`select-menu`}
                        classNamePrefix={'select'}
                        onChange={(value: any) => setFormData({ ...formData, origin: value?.value || '' })}
                        onInputChange={(inputValue) => setFormData({ ...formData, originInput: inputValue })}
                    />
                </div>
    
                <div className='input-container'>
                    <label className='input-label'>Destination</label>
                    <AsyncSelect
                        loadOptions={loadOptions}
                        noOptionsMessage={() => formData.originInput.length < 3 ? 'Start typing to search' : 'No airports found'}
                        placeholder="Where to?"
                        size="md"
                        className={`select-menu`}
                        classNamePrefix={'select'}
                        onChange={(value: any) => setFormData({ ...formData, destination: value?.value || '' })}
                        onInputChange={(inputValue) => setFormData({ ...formData, destinationInput: inputValue })}
                    />
                </div>
            </div>

            <div className='input-container'>
                <label className='input-label'>{formData.trip === 'round-trip' ? 'Departure - Return Dates' : 'Departure Date'}</label>
                {formData.trip === 'round-trip' ? (
                    // round trip date picker
                    <DatePicker
                        selected={startDate}
                        startDate={startDate}
                        endDate={endDate}
                        minDate={new Date()}
                        onChange={(dates) => {
                            const [start, end] = dates;
                            setStartDate(start);
                            setEndDate(end);
                            setFormData({ 
                                ...formData, 
                                departDate: formatDate(start), 
                                returnDate: formatDate(end) 
                            });
                        }}
                        selectsRange
                        showMonthDropdown
                        placeholderText="Select date range"
                        dateFormat="MM/dd/yyyy"
                        className='input-field'
                        showIcon
                        icon={<Calendar size={32} />}
                    />
                ) : (
                    // one way date picker
                    <DatePicker
                        selected={startDate}
                        startDate={startDate}
                        minDate={new Date()}
                        onChange={(date) => {
                            setStartDate(date);
                            setFormData({ ...formData, departDate: formatDate(date)})}
                        }
                        showMonthDropdown
                        placeholderText="Select a date"
                        dateFormat="MM/dd/yyyy"
                        className='input-field'
                        showIcon
                        icon={<Calendar size={32} />}
                    />
                )}
            </div>

            <button type="submit">Search</button>
        </form>
    );
};

export default FlightSearch;