import { Organization } from "./organization";
import { Budget } from "./budget";
import axios from "axios";
import { Flight } from "./flight";
import { UserEvent } from "./userEvent";
import { max } from "date-fns";
import { useSession } from "next-auth/react";
import { User } from "./user";

export class Event {
    id: string;
    iri: string;
    budget: Budget;
    imageBlob?: File; // optional, for image upload
    imageName?: string; // optional, for image upload
    eventTitle: string;
    startDateTime: string; // date-time
    endDateTime: string; // date-time
    startFlightBooking: string; // date-time
    endFlightBooking: string; // date-time
    location: string;
    organization: Organization;
    flights: Flight[];
    inviteCode: string;
    maxAttendees: number;
    attendees: UserEvent[];
    status: string = "pendingApproval"; // default status
    /**
     * @param id the ID of the event
     * @param fetch whether the event data should be fetched from the API
     */
    constructor(id: string = "notPersisted", apiToken: string = "") {
        this.id = id;
        this.eventTitle = "";
        this.startDateTime = "";
        this.endDateTime = "";
        this.startFlightBooking = "";
        this.endFlightBooking = "";
        this.location = "";
        this.organization = new Organization();
        this.flights = [];
        this.inviteCode = "";
        this.maxAttendees = 0;
        this.budget = new Budget();
        this.attendees = [];
        this.iri = `/events/${id}`; // construct IRI if not provided
        if (apiToken !== "") {
            this.fetch(apiToken);
        }
    }

    /**
     * Fetches event data from the API and assigns it to the class properties, given the ID is set.
     * @param apiToken users api token
     * @returns a promise that resolves to void
     */
    async fetch(apiToken: string): Promise<void> {
        if (this.id === "notPersisted") {
            throw new Error("Event ID is not set");
        }
        try {
            const response = await axios.get(this.iri, {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                },
            });
            const data = response.data;
            // assign data to the class properties
            this.budget = data.budget
                ? new Budget(data.budget.id, data.budget.perUserTotal)
                : this.budget;
            this.imageBlob = data.imageBlob
                ? new File(
                      [data.imageBlob],
                      data.imageName || "event-image", // default name if not provided
                      { type: data.imageBlob.type }
                  )
                : undefined;
            this.imageName = data.imageName || undefined;
            this.eventTitle = data.eventTitle;
            this.startDateTime = data.startDateTime;
            this.endDateTime = data.endDateTime;
            this.startFlightBooking = data.startFlightBooking;
            this.endFlightBooking = data.endFlightBooking;
            this.location = data.location;
            this.organization = new Organization(data.organization.id);
            this.organization.setName(data.organization.name);
            this.flights = data.flights.map(
                (flight: any) => new Flight(flight.id)
            );
            this.attendees = data.attendees.map((attendee: any) => {
                const userEvent = new UserEvent(attendee.id);
                userEvent.setUser(new User(attendee.user.id));
                userEvent.user.name = attendee.user.name;
                userEvent.setEvent(this);
                userEvent.status = attendee.status;
                return userEvent;
            });
        } catch (error) {
            console.error("Error fetching event data:", error);
            throw error;
        }
    }

    /**
     * Fetches a single event by ID or event object from the API.
     * @param apiToken users api token
     * @param event the ID of the event or an Event object
     * @returns a promise that resolves to a list of events
     */
    static async oneFromApiResponse(
        apiToken: string,
        event: string | Event
    ): Promise<Event> {
        try {
            // if event is a string, assume it is the ID of the event
            const iri =
                typeof event === "string" ? `/events/${event}` : event.iri;
            const response = await axios.get(iri, {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                },
            });
            const data = response.data;
            // budget could be null for an event. These are unapproved.
            // If the event is unapproved, we need to set the budget to null.
            const budget = data.budget
                ? new Budget(data.budget.id, data.budget.perUserTotal)
                : new Budget();
            const organization = new Organization(data.organization.id);
            const hydratedEvent: Event = new Event(data.id);
            hydratedEvent.setBudget(budget);
            hydratedEvent.setEventTitle(data.eventTitle);
            hydratedEvent.setStartDateTime(data.startDateTime);
            hydratedEvent.setEndDateTime(data.endDateTime);
            hydratedEvent.setStartFlightBooking(data.startFlightBooking);
            hydratedEvent.setEndFlightBooking(data.endFlightBooking);
            hydratedEvent.setLocation(data.location);
            hydratedEvent.setOrganization(organization);
            // event.setFlights() // don't set flights yet
            hydratedEvent.attendees = data.attendees.map((attendee: any) => {
                const userEvent = new UserEvent(attendee.id);
                userEvent.setUser(new User(attendee.user.id));
                userEvent.user.name = attendee.user.name;
                userEvent.setEvent(hydratedEvent);
                userEvent.status = attendee.status;
                return userEvent;
            });
            return hydratedEvent;
        } catch (error) {
            console.error("Error fetching events data:", error);
            throw error;
        }
    }
    /**
     *
     * @param apiToken users api token
     * @param context the context: eventAdmin, financeAdmin, fullAdmin
     * @returns a promise that resolves to a list of events
     */
    static async allFromApiResponse(
        apiToken: string,
        context: string
    ): Promise<Event[]> {
        try {
            var url = "";
            switch (context) {
                case "eventAdmin":
                    url = "/my/organizations/events/eventAdmin";
                    break;
                case "financeAdmin":
                    url = "/my/organizations/events/financeAdmin";
                    break;
                case "fullAdmin":
                    url = "/my/organizations/events/fullAdmin";
                    break;
                default:
                    // throw an error if the context is not recognized
                    throw new Error("Invalid context");
            }
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                },
            });
            // response.data['hydra:view']['hydra:next'] is the next page of results
            const lastPage: number =
                response.data["hydra:view"] &&
                response.data["hydra:view"]["hydra:last"]
                    ? response.data["hydra:view"]["hydra:last"].split("=")[1]
                    : 1;
            var totalEvents = response.data["hydra:member"];
            // if there are more pages, fetch them
            // fetch the next n - 1 pages and apped to the events array
            if (lastPage > 1) {
                for (let index = 2; index <= lastPage; index++) {
                    const nextResponse = await axios.get(
                        url + `?page=${index}`,
                        {
                            headers: {
                                Authorization: `Bearer ${apiToken}`,
                            },
                        }
                    );
                    totalEvents = [
                        ...totalEvents,
                        ...nextResponse.data["hydra:member"],
                    ];
                }
            }
            const events = totalEvents.map((item: any) => {
                const event = new Event(item.id);
                if (item.budget) {
                    event.setBudget(new Budget(item.budget.id));
                    event.budget.perUserTotal = item.budget.perUserTotal;
                    event.budget.overage = item.budget.overage;
                    event.status = "approved";
                } else {
                    event.budget = new Budget("pendingApproval");
                    event.budget.perUserTotal = 0;
                    event.status = "pendingApproval";
                }
                event.setEventTitle(item.eventTitle);
                event.setStartDateTime(item.startDateTime);
                event.setEndDateTime(item.endDateTime);
                event.setStartFlightBooking(item.startFlightBooking);
                event.setEndFlightBooking(item.endFlightBooking);
                event.flights = item.flights.map((flight: any) => {
                    const flightObj = new Flight(flight.id);
                    flightObj.flightCost = flight.flightCost;
                    flightObj.approvalStatus = flight.approvalStatus;
                    flightObj.bookingReference = flight.bookingReference;
                    return flightObj;
                });
                event.setLocation(item.location);
                event.setOrganization(
                    new Organization(item.organization["@id"])
                );
                event.maxAttendees = item.maxAttendees;
                event.location = item.location;
                event.organization.setName(item.organization.name);
                context === "eventAdmin"
                    ? (event.attendees = item.attendees.map((attendee: any) => {
                          const userEvent = new UserEvent(attendee.id);
                          userEvent.setUser(new User(attendee.user.id));
                          userEvent.user.name = attendee.user.name;
                          userEvent.user.email = attendee.user.email;
                          userEvent.setEvent(event);
                          userEvent.status = attendee.status;
                          return userEvent;
                      }))
                    : (event.attendees = []);
                return event;
                // event.setFlights() // dont set flights yet
            });
            return events;
        } catch (error) {
            console.error("Error fetching events data:", error);
            throw error;
        }
    }
    /**
     * Will persist the event to the API. If the ID is set,
     * this will attmept to patch the event as opposed to creating a new one.
     * @param apiToken users api token
     */
    async persist(apiToken: string): Promise<void> {
        switch (this.id) {
            case "notPersisted":
                // check if required fields are set
                if (
                    !this.eventTitle ||
                    !this.startDateTime ||
                    !this.endDateTime ||
                    !this.startFlightBooking ||
                    !this.endFlightBooking ||
                    !this.location ||
                    !this.organization
                ) {
                    throw new Error("Missing required fields");
                }
                // create a new event
                try {
                    const response = await axios.post(
                        "/events",
                        {
                            eventTitle: this.eventTitle,
                            startDateTime: this.startDateTime,
                            endDateTime: this.endDateTime,
                            startFlightBooking: this.startFlightBooking,
                            endFlightBooking: this.endFlightBooking,
                            location: this.location,
                            organization: this.organization.getIri(),
                            maxAttendees: this.maxAttendees,
                            inviteCode: this.inviteCode,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${apiToken}`,
                                "Content-Type": "application/ld+json",
                                Accept: "application/ld+json",
                            },
                        }
                    );
                    // set the id of the event to the generated ID
                    this.id = response.data.id;
                    this.iri = response.data["@id"];
                } catch (error) {
                    console.error("Error creating event:", error);
                    throw error;
                }
                break;

            default:
                // check if the id is a string, not undefined
                if (typeof this.id !== "string") {
                    throw new Error("Invalid event ID");
                }
                // update the event
                // event should be populated fully with data
                try {
                    const response = await axios.patch(
                        this.iri,
                        {
                            eventTitle: this.eventTitle,
                            startDateTime: this.startDateTime,
                            endDateTime: this.endDateTime,
                            startFlightBooking: this.startFlightBooking,
                            endFlightBooking: this.endFlightBooking,
                            location: this.location,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${apiToken}`,
                                "Content-Type": "application/merge-patch+json",
                            },
                        }
                    );
                } catch (error) {
                    console.error("Error updating event:", error);
                    throw error;
                }
                break;
        }
    }

    setBudget(budget: Budget): void {
        this.budget = budget;
    }

    setEventTitle(eventTitle: string): void {
        this.eventTitle = eventTitle;
    }

    setStartDateTime(startDateTime: string): void {
        this.startDateTime = startDateTime;
    }

    setEndDateTime(endDateTime: string): void {
        this.endDateTime = endDateTime;
    }

    setStartFlightBooking(startFlightBooking: string): void {
        this.startFlightBooking = startFlightBooking;
    }

    setEndFlightBooking(endFlightBooking: string): void {
        this.endFlightBooking = endFlightBooking;
    }

    setLocation(location: string): void {
        this.location = location;
    }

    setOrganization(organization: Organization): void {
        this.organization = organization;
    }

    setFlights(flights: Flight[]): void {
        this.flights = flights;
    }
    getIri(): string {
        return this.iri;
    }
    getEventTitle(): string {
        if (!this.eventTitle) {
            throw new Error("Event name is not set");
        }
        return this.eventTitle;
    }
    getOrganization(): Organization {
        if (!this.organization) {
            throw new Error("Organization is not set");
        }
        return this.organization;
    }
    getFriendlyStartDate = () => {
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "short",
            day: "numeric",
        };
        return new Date(this.startDateTime).toLocaleDateString(
            undefined,
            options
        );
    };
    getFriendlyEndDate = () => {
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "short",
            day: "numeric",
        };
        return new Date(this.endDateTime).toLocaleDateString(
            undefined,
            options
        );
    };
    getEventTotal(): number {
        if (this.budget.perUserTotal && this.maxAttendees) {
            var total = this.budget.perUserTotal * this.maxAttendees;
            total += this.budget.overage;
            return total;
        }
        return 0;
    }
}
