export interface Airport {
    code: string;
    name: string;
    location: string;
}

export interface Flight {
    airline: string;
    flightNumber: string;
    date: string;
    time: string;
    price: number;
    notes?: string[];
}