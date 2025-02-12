import React, { useState } from 'react';
import EventForm from './EventForm';
import { Event } from 'types/events';
import { useContent } from 'Utils/ContentProvider';
import NearbyAirports from './NearbyAirports';
import Input from 'Components/common/Input';

interface AirportSearchProps {
    event: Event;
}

const AirportSearch: React.FC<AirportSearchProps> = ({ event }) => {
    const [formData, setFormData] = useState({
        zip: "",
        airport: "",
        trip: "round-trip",
    });
    const { setContent } = useContent();

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setContent(<NearbyAirports />, "Nearby Airports");
    };

    return (
        <EventForm event={event}>
            <form onSubmit={handleSubmit}>
                <h2>Airport Search</h2>
    
                <label htmlFor="zip">Enter Your ZIP Code:</label>
                <input 
                    type="text" 
                    id="zip" 
                    name="zip" 
                    placeholder="20817" 
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                />

                <p>--OR--</p>
    
                <label htmlFor="airport">Enter Airport Code:</label>
                <input 
                    type="text" 
                    id="airport" 
                    name="airport" 
                    placeholder="BWI" 
                    value={formData.airport}
                    onChange={(e) => setFormData({ ...formData, airport: e.target.value })}
                />
    
                <p>One Way or Round Trip?</p>
                <input 
                    type="radio" 
                    id="one-way" 
                    name="trip" 
                    value="one-way" 
                    checked={formData.trip === "one-way"}
                    onChange={(e) => setFormData({ ...formData, trip: e.target.value })}
                />
                <label htmlFor="one-way">One Way</label>
    
                <input 
                    type="radio" 
                    id="round-trip" 
                    name="trip" 
                    value="round-trip" 
                    checked={formData.trip === "round-trip"}
                    onChange={(e) => setFormData({ ...formData, trip: e.target.value })}
                />
                <label htmlFor="round-trip">Round Trip</label>
    
                <br /><br />
    
                <button type="submit">Search</button>
            </form>
        </EventForm>
    );
};

export default AirportSearch;