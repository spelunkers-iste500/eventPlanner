import React from 'react';

interface ReturnDateTimeProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onDateChange?: (date: string) => void;
  onTimeChange?: (time: string) => void;
  defaultDate?: string;
  defaultTime?: string;
}

const ReturnDateTime: React.FC<ReturnDateTimeProps> = ({
  onPrevious = () => {},
  onNext = () => {},
  onDateChange = () => {},
  onTimeChange = () => {},
  defaultDate = '',
  defaultTime = ''
}) => {
  return (
    <div>
      <h2>Return Date & Time</h2>
      
      <div>
        <div>
          <label htmlFor="returnDate">Preferred Return Date:</label>
          <input
            type="date"
            id="returnDate"
            placeholder="mm/dd/yyyy"
            defaultValue={defaultDate}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="returnTime">Preferred Return Time:</label>
          <input
            type="time"
            id="returnTime"
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

export default ReturnDateTime;