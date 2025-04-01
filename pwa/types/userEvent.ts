import { Flight } from './flight';
import { Event } from './events';
import axios from 'axios';

export class UserEvent {
    static url = '/my/events';
    id: string;
    event: Event;
    status: string;
    flights: Flight[];
    constructor(
        id: string,
        event: Event,
        status: string,
        flights: Flight[]
    ) {
        this.id = id;
        this.event = event;
        this.status = status;
        this.flights = flights;
    }
    /**
     * Fetches userEvents data from the API for the current user.
     * @param {string} apiToken - The API token for authentication.
     * @returns {Promise<UserEvent>} - A promise that resolves to a User object.
    */
    static async fromApiResponse(apiToken: string): Promise<UserEvent[]> {
        try {
            const reponse = await axios.get(this.url, {
                headers: {
                    "Content-Type": "application/ld+json",
                    Authorization: "Bearer " + apiToken,
                }
            }
        )
            const data = reponse.data['hydra:member'];
            const userEvents = data.map((item: any) => {
                // for each UserEvent returned from the API, create a new UserEvent object
                const flights = item.flights.map((flight: any) => new Flight(
                    // create a new Flight object for each flight attached to the UserEvent
                    // should only be one realistically.
                    flight.id,
                    flight.departureAirport,
                    flight.arrivalAirport,
                    flight.departureDateTime,
                    flight.returnDateTime,
                    flight.flightNumber,
                    flight.airline,
                    flight.status
                ));
                return new UserEvent(
                    item.id,
                    item.event,
                    item.status,
                    flights
                );
            });
            return userEvents;
        } catch (err) {
            console.error("Failed to fetch user events data: ", err);
            throw err;
        }
    }

}