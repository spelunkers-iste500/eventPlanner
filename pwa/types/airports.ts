export interface Airport {
    code: string;
    name: string;
    location: string;
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