import React from 'react';

interface ReturnFlight {
  airline: string;
  flightNumber: string;
  date: string;
  time: string;
  price: number;
}

interface ReturnFlightListProps {
  flights?: ReturnFlight[];
  onSelect?: (flight: ReturnFlight) => void;
  onLoadMore?: () => void;
  onPrevious?: () => void;
}

const ReturnFlightList: React.FC<ReturnFlightListProps> = ({
  flights = [
    {
      airline: 'United',
      flightNumber: '1240',
      date: 'Dec 11, 2024',
      time: '4pm',
      price: 320
    },
    {
      airline: 'Jet Blue',
      flightNumber: '3570',
      date: 'Dec 11, 2024',
      time: '4pm',
      price: 334
    },
    {
      airline: 'Delta',
      flightNumber: '1287',
      date: 'Dec 11, 2024',
      time: '6pm',
      price: 349
    }
  ],
  onSelect = () => {},
  onLoadMore = () => {},
  onPrevious = () => {}
}) => {
  return (
    <div>
      <h2>Available Return Flights</h2>
      <p>{flights.length} Results</p>
      
      <div>
        {flights.map((flight) => (
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

export default ReturnFlightList;