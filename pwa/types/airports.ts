export interface Airport {
    code: string;
    name: string;
    distance: string;
}

export interface Flight {
    airline: string;
    flightNumber: string;
    date: string;
    time: string;
    price: number;
    notes?: string[];
}