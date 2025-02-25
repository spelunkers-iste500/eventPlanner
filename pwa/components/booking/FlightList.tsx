import React, { useEffect, useState } from 'react';
import { Flight } from 'types/airports';
import { useBooking } from 'Utils/BookingProvider';
import DepartureDateTime from './DepartureDateTime';
import FlightDetails from './FlightDetails';

const FlightList: React.FC = () => {
	const { bookingData, setBookingData } = useBooking();
	const [flightList, setFlightList] = useState<Flight[]>([]);

	const flights = [
		{
		  airline: 'United',
		  flightNumber: '1240',
		  date: 'Dec 4, 2024',
		  time: '4pm',
		  price: 320
		},
		{
		  airline: 'Jet Blue',
		  flightNumber: '3570',
		  date: 'Dec 4, 2024',
		  time: '4pm',
		  price: 334
		},
		{
		  airline: 'Delta',
		  flightNumber: '1287',
		  date: 'Dec 4, 2024',
		  time: '6pm',
		  price: 349
		}
	];

	useEffect(() => {
		// Simulate an API call
		setTimeout(() => {
			setFlightList(flights);
		}, 1000);
	}, []);

	const onPrevious = () => {
		setBookingData({ ...bookingData, content: <DepartureDateTime /> });
	}

	const onSelect = (flight: Flight) => {
		setBookingData({ ...bookingData, departFlight: flight, content: <FlightDetails /> });
	}

	const onLoadMore = () => {
		console.log('Loading more flights...');
	}

	return (
		<div>
			<h2>Available Departure Flights</h2>
			<p>{flightList.length} Results</p>
			
			<div>
				{flightList.map((flight) => (
					<div key={flight.flightNumber}>
						<div>
							<span>{flight.airline} {flight.flightNumber}</span>
							<button onClick={() => onSelect(flight)}>Select</button>
						</div>
						<div>
							<span>{flight.date} • {flight.time}</span>
							<span>Starting at ${flight.price}</span>
						</div>
					</div>
				))}
			</div>

			<div>
				<button onClick={onPrevious}>← Previous</button>
				<button onClick={onLoadMore}>Load More</button>
			</div>
		</div>
	);
};

export default FlightList;