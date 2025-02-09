import React from 'react';

interface DepartureDateTimeProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onDateChange?: (date: string) => void;
  onTimeChange?: (time: string) => void;
  defaultDate?: string;
  defaultTime?: string;
}

const DepartureDateTime: React.FC<DepartureDateTimeProps> = ({
  onPrevious = () => {},
  onNext = () => {},
  onDateChange = () => {},
  onTimeChange = () => {},
  defaultDate = '',
  defaultTime = ''
}) => {
  return (
    <div>
      <h2>Departure Date & Time</h2>
      
      <div>
        <div>
          <label htmlFor="departureDate">Preferred Departure Date:</label>
          <input
            type="date"
            id="departureDate"
            placeholder="mm/dd/yyyy"
            defaultValue={defaultDate}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="departureTime">Preferred Departure Time:</label>
          <input
            type="time"
            id="departureTime"
            placeholder="Select Time"
            defaultValue={defaultTime}
            onChange={(e) => onTimeChange(e.target.value)}
          />
        </div>
      </div>

      <div>
        <button onClick={onPrevious}>← Previous</button>
        <button onClick={onNext}>Next →</button>
      </div>
    </div>
  );
};

export default DepartureDateTime;