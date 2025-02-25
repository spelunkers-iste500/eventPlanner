import React, { useState } from 'react';
import { useBooking } from 'Utils/BookingProvider';
import NearbyAirports from './NearbyAirports';
import FlightList from './FlightList';
import Input from 'Components/common/Input';

const DepartureDateTime: React.FC = () => {
	const { bookingData, setBookingData } = useBooking();
	
	const [formData, setFormData] = useState({
		date: '',
		time: '',
	});

	const onPrevious = () => {
		setBookingData({ ...bookingData, content: <NearbyAirports /> });
	}

	const onNext = (departDate: string, departTime: string) => {
		setBookingData({ ...bookingData, departDate: departDate, departTime: departTime, content: <FlightList /> });
	}

	return (
		<div>
			<h2>Departure Date & Time</h2>
			
			<div>
				<Input
					type='date'
					label='Preferred Departure Date'
					placeholder='mm/dd/yyyy'
					onChange={(value) => setFormData({ ...formData, date: value })}
				/>

				<Input
					type='time'
					label='Preferred Departure Time'
					placeholder='hh:mm am/pm'
					onChange={(value) => setFormData({ ...formData, time: value })}
				/>
			</div>

			<div>
				<button onClick={onPrevious}>← Previous</button>
				<button onClick={() => onNext(formData.date, formData.time)}>Next →</button>
			</div>
		</div>
	);
};

export default DepartureDateTime;