export interface Airport {
    iata_code: string;
    name: string;
}

/**
 * Represents a flight with details such as airline, flight number, date, time, and price.
 * Optionally, it can include additional notes.
 */
export interface Flight {
    airline: string;
    flightNumber: string;
    date: string;
    time: string;
    price: number;
    notes?: string[];
}

export interface Segment {
    departing_at: string;
    arriving_at: string;
    duration: string;
    origin: {
        iata_code: string;
    };
    destination: {
        iata_code: string;
    };
    passengers: Passenger[];
    marketing_carrier: {
        name: string;
        logo_symbol_url: string;
    }
}

export interface Slice {
    origin: {
        iata_code: string;
    };
    destination: {
        iata_code: string;
    };
    segments: Segment[];
}

export interface Passenger {
    id: string;
    cabin_class_marketing_name: string;
}

export interface Offer {
    id: string;
    base_amount: string;
    total_amount: string;
    passengers: Passenger[];
    slices: Slice[];
}