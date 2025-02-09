import React, { useState } from 'react';

interface ReturnFlightDetailsData {
  airline: string;
  flightNumber: string;
  date: string;
  time: string;
  notes?: string[];
}

interface ReturnFlightDetailsProps {
  flight?: ReturnFlightDetailsData;
  onPrevious?: () => void;
  onReserve?: () => void;
}

const ReturnFlightDetails: React.FC<ReturnFlightDetailsProps> = ({
  flight = {
    airline: 'United Airlines',
    flightNumber: '1240',
    date: 'Dec 4, 2024',
    time: '4pm',
    notes: ['Round Trip', 'One Stop']
  },
  onPrevious = () => {},
  onReserve = () => {}
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('');

  return (
    <div>
      <h2>Return Flight Details</h2>
      
      <div>
        <h3>{flight.airline} {flight.flightNumber}</h3>
        
        <div>
          <h3>Return:</h3>
          <p>{flight.date} • {flight.time}</p>
          {flight.notes && (
            <p>{flight.notes.join(', ')}</p>
          )}
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

export default ReturnFlightDetails;