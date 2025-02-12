import React, { use, useEffect, useState } from "react";
import { useContent } from "Utils/ContentProvider";
import AirportSearch from "./AirportSearch";

const NearbyAirports = () => {
  const { setContent } = useContent();

  const airports = [
    { code: "IAD", name: "Dulles International Airport", distance: "12 Miles Away" },
    { code: "DCA", name: "Ronald Reagan Washington National Airport", distance: "16 Miles Away" },
    { code: "BWI", name: "Baltimore/Washington International Thurgood Marshall Airport", distance: "23 Miles Away" }
  ];
  
  const [nearbyAirports, setNearbyAirports] = useState<{ code: string; name: string; distance: string; }[]>([]);

  // Simulate an API call
  useEffect(() => {
    setTimeout(() => {
      setNearbyAirports(airports);
    }, 3000);
  }, []);

  const handlePrevious = () => {
    // setContent(<AirportSearch event={event} />, "Airport Search");
  };

  // while loading
  if (!nearbyAirports) {
    return (
      <div className="animation-container">
        <div className="magnifying-glass-container">
          <div className="magnifying-glass"></div>
        </div>
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
          <button>Select</button>
        </div>
      ))}
      <button onClick={handlePrevious}>← Previous</button>
    </div>
  );
};

export default NearbyAirports;
