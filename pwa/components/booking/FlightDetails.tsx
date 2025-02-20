import React, { useState } from "react";
import { useBooking } from "Utils/BookingProvider";
import FlightList from "./FlightList";
import ReturnDateTime from "./ReturnDateTime";
import { useContent } from "Utils/ContentProvider";
import Dashboard from "Components/dashboard/Dashboard";
import { toaster } from "Components/ui/toaster";

const FlightDetails: React.FC = () => {
    const [selectedClass, setSelectedClass] = useState<string>("");
	const { bookingData, setBookingData } = useBooking();
	const { setContent } = useContent();
    const flight = bookingData?.departFlight;

	const onPrevious = () => {
		setBookingData({ ...bookingData, content: <FlightList /> });
	};

	const onReserve = () => {
		bookingData.isRoundTrip ?
			setBookingData({ ...bookingData, content: <ReturnDateTime /> }) 
		:
			setContent(<Dashboard />, 'Dashboard');
            toaster.create({
                title: "Flight Reserved",
                description: "Your flight has successfully been reserved.",
                type: "success",
                duration: 3000,
                placement: 'top-end'
            });
		;
	}

    return (
        <div>
            <h2>Departure Flight Details</h2>

            <div>
                <h3>
                    {flight?.airline} {flight?.flightNumber}
                </h3>

                <div>
                    <h3>Departure:</h3>
                    <p>
                        {flight?.date} • {flight?.time}
                    </p>
                    {flight?.notes && <p>{flight.notes.join(", ")}</p>}
                </div>

                <div>
                    <h4>Select Class:</h4>
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                    >
                        <option value="">None Selected</option>
                        <option value="economy">Economy</option>
                        <option value="business">Business</option>
                        <option value="first">First Class</option>
                    </select>
                </div>

                <div>
                    <button onClick={onPrevious}>← Previous</button>
                    <button onClick={onReserve}>Reserve</button>
                </div>
            </div>
        </div>
    );
};

export default FlightDetails;
