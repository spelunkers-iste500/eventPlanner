import { Flight } from "./flight";
import { Event } from "./event";
import axios from "axios";
import { User } from "./user";
import { Organization } from "./organization";
import { Budget } from "./budget";

export class UserEvent {
    id: string;
    event: Event;
    user: User;
    flights: Flight[];
    status: string = "";
    constructor(id: string = "notPersisted", apiToken: string = "") {
        this.id = id;
        this.event = new Event();
        this.user = new User();
        this.flights = [];
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
            const organization = new Organization(
                response.data.event.organization.id
            );
            organization.name = response.data.event.organization.name;
            this.event.setOrganization(organization);
            this.event.setLocation(response.data.event.location);
            this.event.setStartDateTime(response.data.event.startDateTime);
            this.event.setEndDateTime(response.data.event.endDateTime);
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
            if (response.data["hydra:view"]) {
                // figure out how many pages need to be fetched
                // start at 2, go until the last page
                const lastPage = response.data["hydra:view"]["hydra:last"];
                const lastPageNumber = parseInt(lastPage.split("=")[1]);
                const currentPageNumber = 2;
                for (let page = 2; page <= lastPageNumber; page++) {
                    const nextResponse = await axios.get(
                        `/my/events?page=${page}`,
                        {
                            headers: {
                                Authorization: `Bearer ${apiToken}`,
                                Accept: "application/ld+json",
                            },
                        }
                    );
                    response.data["hydra:member"] = response.data[
                        "hydra:member"
                    ].concat(nextResponse.data["hydra:member"]);
                }
            }
            return response.data["hydra:member"].map((userEvent: any) => {
                const userEventInstance = new UserEvent(userEvent.id);
                userEventInstance.event = new Event(userEvent.event.id);
                userEventInstance.event.maxAttendees =
                    userEvent.event.maxAttendees;
                const organization = new Organization(
                    userEvent.event.organization.id
                );
                organization.name = userEvent.event.organization.name;
                userEventInstance.event.setOrganization(organization);
                userEventInstance.event.setLocation(userEvent.event.location);
                userEventInstance.event.setStartDateTime(
                    userEvent.event.startDateTime
                );
                userEventInstance.event.setEndDateTime(
                    userEvent.event.endDateTime
                );
                userEventInstance.event.setEventTitle(
                    userEvent.event.eventTitle
                );
                if (userEvent.event.budget) {
                    userEventInstance.event.budget = new Budget(
                        userEvent.event.budget.id
                    );
                    userEventInstance.event.budget.perUserTotal =
                        userEvent.event.budget.perUserTotal;
                }
                userEventInstance.user = new User(userEvent.user.id);
                userEventInstance.flights = userEvent.flights
                    .filter(
                        (flight: any) => flight.event.id == userEvent.event.id
                    )
                    .map((flight: any) => {
                        const flightInstance = new Flight(flight.id);
                        flightInstance.setDepartureDateTime(
                            flight.departureDateTime
                        );
                        flightInstance.setArrivalDateTime(
                            flight.arrivalDateTime
                        );
                        flightInstance.setDepartureLocation(
                            flight.departureLocation
                        );
                        flightInstance.setArrivalLocation(
                            flight.arrivalLocation
                        );
                        return flightInstance;
                    });
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
