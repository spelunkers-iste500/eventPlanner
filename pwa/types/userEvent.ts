import { Flight } from "./flight";
import { Event } from "./event";
import axios from "axios";
import { User } from "./user";

export class UserEvent {
    id: string;
    event?: Event;
    user?: User;
    flights?: Flight[];
    constructor(id: string = "notPersisted", apiToken: string = "") {
        this.id = id;
        if (apiToken !== "" && id == "notPersisted") {
            throw new Error("Cannot fetch user event data without an ID");
        } else if (apiToken !== "" && id !== "notPersisted") {
            // Fetch the user event data from the API
            this.fetch(apiToken);
        }
    }
    async fetch(apiToken: string) {
        try {
            const response = await axios.get(`/my/events`, {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                },
            });
            this.event = new Event(response.data.event.id);
            this.user = new User(response.data.user.id);
            this.flights = response.data.flights.map(
                (flight: any) => new Flight(flight.id)
            );
        } catch (error) {
            console.error("Error fetching user event data:", error);
        }
    }

    async persist(apiToken: string) {
        if (!this.event || !this.user) {
            throw new Error("Event and User must be set before persisting");
        }
        if (this.id !== "notPersisted") {
            throw new Error("UserEvent already persisted");
        }
        try {
            const response = await axios.post(
                `/my/events`,
                {
                    user: this.user.getIri(),
                    event: this.event.getIri(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${apiToken}`,
                    },
                }
            );
            this.id = response.data.id;
        } catch (error) {
            console.error("Error persisting user event data:", error);
        }
    }

    setId(id: string) {
        this.id = id;
    }

    setEvent(event: Event) {
        this.event = event;
    }

    setUser(user: User) {
        this.user = user;
    }

    setFlights(flights: Flight[]) {
        this.flights = flights;
    }
    getEvent(): Event {
        if (!this.event) {
            throw new Error("Event is not set");
        }
        return this.event;
    }
}
