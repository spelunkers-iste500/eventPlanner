import React from "react";

const nearbyAirports = [
  { code: "IAD", name: "Dulles International Airport", distance: "12 Miles Away" },
  { code: "DCA", name: "Ronald Reagan Washington National Airport", distance: "16 Miles Away" },
  { code: "BWI", name: "Baltimore/Washington International Thurgood Marshall Airport", distance: "23 Miles Away" }
];

const NearbyAirports = () => {
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
      <button>← Previous</button>
    </div>
  );
};

export default NearbyAirports;
