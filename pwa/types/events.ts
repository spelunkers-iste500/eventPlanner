// Define types for the event data
export interface Event {
    id: number;
    img: string;
    name: string;
    org: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
    departureAirportCode: string;
    departureDate?: string;
    returnDate?: string;
    attendeeBudget: string;
    usedBudget?: string;
}