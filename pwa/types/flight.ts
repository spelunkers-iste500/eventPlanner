export class Flight {
    constructor(
        id: string,
        departureAirport: string,
        arrivalAirport: string,
        departureDateTime: string,
        returnDateTime: string,
        flightNumber: string,
        airline: string,
        status: string
    ) {
        this.id = id;
        this.departureAirport = departureAirport;
        this.arrivalAirport = arrivalAirport;
        this.departureDateTime = departureDateTime;
        this.returnDateTime = returnDateTime;
        this.flightNumber = flightNumber;
        this.airline = airline; // Might be removed in the future, duffel doesn't return this.
        this.status = status;
        
    }
    id: string;
    departureAirport: string;
    arrivalAirport: string;
    departureDateTime: string;
    returnDateTime: string;
    flightNumber: string;
    airline: string;
    status: string;
}