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
    flight: Flight;
    status: string = "";
    email: string = "";
    constructor(id: string = "notPersisted", apiToken: string = "") {
        this.id = id;
        this.event = new Event();
        this.user = new User();
        this.flight = new Flight();
        if (apiToken !== "" && id == "notPersisted") {
            throw new Error("Cannot fetch user event data without an ID");
        } else if (apiToken !== "" && id !== "notPersisted") {
            // Fetch the user event data from the API
            this.fetch(apiToken);
        }
    }

    async persist(apiToken: string) {
        try {
            const response = await axios.patch(
                `/user_events/${this.id}`,
                {
                    status: this.status,
                },
                {
                    headers: {
                        Authorization: `Bearer ${apiToken}`,
                        "Content-Type": "application/merge-patch+json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error persisting user event data:", error);
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
            if (response.data.flight) {
                this.flight.id = response.data.flight.id;
                this.flight.setDepartureDateTime(
                    response.data.flight.departureDateTime
                );
                this.flight.setArrivalDateTime(
                    response.data.flight.arrivalDateTime
                );
                this.flight.setDepartureLocation(
                    response.data.flight.departureLocation
                );
                this.flight.setArrivalLocation(
                    response.data.flight.arrivalLocation
                );
                this.flight.setFlightNumber(response.data.flight.flightNumber);
                this.flight.setApprovalStatus(
                    response.data.flight.approvalStatus
                );
            }
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
                userEventInstance.setEmail(userEvent.email);
                if (userEvent.event.budget) {
                    userEventInstance.event.budget = new Budget(
                        userEvent.event.budget.id
                    );
                    userEventInstance.event.budget.perUserTotal =
                        userEvent.event.budget.perUserTotal;
                }
                if (userEvent.user) {
                    userEventInstance.user = new User(userEvent.user.id);
                }
                if (userEvent.flight) {
                    userEventInstance.flight.id = userEvent.flight.id;
                    userEventInstance.flight.setDepartureDateTime(
                        userEvent.flight.departureDateTime
                    );
                    userEventInstance.flight.setArrivalDateTime(
                        userEvent.flight.arrivalDateTime
                    );
                    userEventInstance.flight.setDepartureLocation(
                        userEvent.flight.departureLocation
                    );
                    userEventInstance.flight.setArrivalLocation(
                        userEvent.flight.arrivalLocation
                    );
                    userEventInstance.flight.setFlightNumber(
                        userEvent.flight.flightNumber
                    );
                    userEventInstance.flight.setApprovalStatus(
                        userEvent.flight.approvalStatus
                    );
                }
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

    setFlights(flight: Flight) {
        this.flight = flight;
    }
    getEvent(): Event {
        if (!this.event) {
            throw new Error("Event is not set");
        }
        return this.event;
    }
    getFlight(): Flight {
        if (!this.flight) {
            throw new Error("Flight is not set");
        }
        return this.flight;
    }
    setEmail(email: string) {
        this.email = email;
    }
}
