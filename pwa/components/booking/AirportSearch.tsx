import React, {useState} from 'react';
import router from 'next/router';

const AirportSearch: React.FC = () => {
    const [formData, setFormData] = useState({
        zip: "",
        airport: "",
        trip: "round-trip",
    });
    
    const handleSubmit = () => {
        router.push(`/booking/NearbyAirports`);
    };
    
    return (
        <form>
        <h2>Airport Search</h2>
    
        <label htmlFor="zip">Enter Your ZIP Code:</label>
        <input type="text" id="zip" name="zip" placeholder="20817" />
    
        <p>--OR--</p>
    
        <label htmlFor="airport">Enter Airport Code:</label>
        <input type="text" id="airport" name="airport" placeholder="BWI" />
    
        <p>One Way or Round Trip?</p>
        <input type="radio" id="one-way" name="trip" value="one-way" />
        <label htmlFor="one-way">One Way</label>
    
        <input type="radio" id="round-trip" name="trip" value="round-trip" defaultChecked />
        <label htmlFor="round-trip">Round Trip</label>
    
        <br /><br />
    
        <button type="submit">Search</button>
        </form>
    );
    };
    
    export default AirportSearch;