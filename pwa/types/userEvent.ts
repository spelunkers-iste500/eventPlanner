import { Flight } from "./flight";
import { Event } from "./event";
import axios from "axios";
import { User } from "./user";
import { Organization } from "./organization";

export class UserEvent {
    id: string;
    event?: Event;
    user?: User;
    flights?: Flight[];
    status?: string;
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
            const response = await axios.get(`/user_event/${this.id}`, {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                },
            });
            this.event = new Event(response.data.event.id);
            this.user = new User(response.data.user.id);
            this.flights = response.data.flights.map(
                (flight: any) => new Flight(flight.id)
            );
            this.status = response.data.status;
        } catch (error) {
            console.error("Error fetching user event data:", error);
        }
    }

    static async allFromApiResponse(apiToken: string): Promise<UserEvent[]> {
        try {
            const response = await axios.get(`/my/events`, {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                },
            });
            return response.data["hydra:member"].map((userEvent: any) => {
                const userEventInstance = new UserEvent(userEvent.id);
                userEventInstance.event = new Event(userEvent.event.id);
                userEventInstance.event.setOrganization(
                    new Organization(userEvent.event.organization.id)
                );
                userEventInstance.event.setLocation(userEvent.event.location);
                userEventInstance.event.setStartDateTime(
                    userEvent.event.startDate
                );
                userEventInstance.event.setEndDateTime(userEvent.event.endDate);
                userEventInstance.event.setEventTitle(
                    userEvent.event.eventTitle
                );
                userEventInstance.user = new User(userEvent.user.id);
                userEventInstance.flights = userEvent.flights.map(
                    (flight: any) => new Flight(flight.id)
                );
                userEventInstance.status = userEvent.status;
                return userEventInstance;
            });
        } catch (error) {
            console.error("Error fetching user events:", error);
            return [];
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
    getFlights(): Flight[] {
        if (!this.flights) {
            throw new Error("Flights are not set");
        }
        return this.flights;
    }
}
