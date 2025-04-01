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
}
