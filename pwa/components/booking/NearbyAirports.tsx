import React, { useEffect, useState } from "react";
import AirportSearch from "./AirportSearch";
import { useBooking } from "Utils/BookingProvider";
import { Airport } from "types/airports";
import DepartureDateTime from "./DepartureDateTime";
import { Spinner } from "@chakra-ui/react";

const NearbyAirports = () => {
	const { bookingData, setBookingData } = useBooking();
	const [nearbyAirports, setNearbyAirports] = useState<Airport[]>([]);

	const airports = [
		{ code: "IAD", name: "Dulles International Airport", distance: "12 Miles Away" },
		{ code: "DCA", name: "Ronald Reagan Washington National Airport", distance: "16 Miles Away" },
		{ code: "BWI", name: "Baltimore/Washington International Thurgood Marshall Airport", distance: "23 Miles Away" }
	];

	// Simulate an API call
	useEffect(() => {
		setTimeout(() => {
			setNearbyAirports(airports);
		}, 3000);
	}, []);

	const handlePrevious = () => {
		setBookingData({ ...bookingData, content: <AirportSearch /> });
	};

	// Handle airport selection
	const handleSelect = (airport: Airport) => {
		setBookingData({ ...bookingData, departAirport: airport, content: <DepartureDateTime /> });
	}

	// while loading
	if (nearbyAirports.length === 0) {
		return (
			<div className='loading-container'>
				<Spinner size="xl" color='var(--blue-500)' />
			</div>
		);
	}

	return (
		<div>
			<h2>Nearby Airports</h2>
			{nearbyAirports.map((airport) => (
				<div key={airport.code}>
					<h3>{airport.code}</h3>
					<p>{airport.name}</p>
					<p>{airport.distance}</p>
					<button onClick={() => handleSelect(airport)}>Select</button>
				</div>
			))}
			<button onClick={handlePrevious}>← Previous</button>
		</div>
	);
};

export default NearbyAirports;
