import { Organization } from "./organization";
import { Budget } from "./budget";
import axios from "axios";
import { Flight } from "./flight";

export class Event {
    /**
     *
     * @param id the ID of the event
     * @param fetch whether the event data should be fetched from the API
     */
    constructor(id: string = "notPersisted", apiToken: string = "") {
        this.id = id;
        this.iri = `/events/${id}`; // construct IRI if not provided
        if (apiToken !== "") {
            this.fetchData(apiToken);
        }
    }

    setBudget(budget: Budget | null): void {
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

    setOrganization(organization: Organization | undefined): void {
        this.organization = organization;
    }

    setFlights(flights: Flight[]): void {
        this.flights = flights;
    }

    /**
     * Fetches event data from the API and assigns it to the class properties, given the ID is set.
     * @param apiToken users api token
     * @returns a promise that resolves to void
     */
    async fetchData(apiToken: string): Promise<void> {
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
                : null;
            this.eventTitle = data.eventTitle;
            this.startDateTime = data.startDateTime;
            this.endDateTime = data.endDateTime;
            this.startFlightBooking = data.startFlightBooking;
            this.endFlightBooking = data.endFlightBooking;
            this.location = data.location;
            this.organization = new Organization(
                data.organization.id,
                data.organization.name
            );
            this.flights = data.flights.map(
                (flight: any) =>
                    new Flight(
                        flight.id,
                        flight.departureAirport,
                        flight.arrivalAirport,
                        flight.departureDateTime,
                        flight.returnDateTime,
                        flight.flightNumber,
                        flight.airline,
                        flight.status
                    )
            );
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
            let budget = null;
            if (data.budget) {
                budget = new Budget(data.budget.id, data.budget.perUserTotal);
            }
            const organization = new Organization(
                data.organization.id,
                data.organization.name
            );
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
            var url;
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
                response.data["hydra:view"]["hydra:last"].split("=")[1];
            const events = response.data["hydra:member"].map((item: any) => {
                const event = new Event(item.id);
                event.setBudget(
                    item.budget
                        ? new Budget(item.budget.id, item.budget.perUserTotal)
                        : null
                );
                event.setEventTitle(item.eventTitle);
                event.setStartDateTime(item.startDateTime);
                event.setEndDateTime(item.endDateTime);
                event.setStartFlightBooking(item.startFlightBooking);
                event.setEndFlightBooking(item.endFlightBooking);
                event.setLocation(item.location);
                event.setOrganization(
                    new Organization(
                        item.organization.id,
                        item.organization.name
                    )
                );
                // event.setFlights() // dont set flights yet
            });
            // if there are more pages, fetch them
            // fetch the next n - 1 pages and apped to the events array
            for (let index = 2; index <= lastPage; index++) {
                const response = await axios.get(url + `?page=${index}`, {
                    headers: {
                        Authorization: `Bearer ${apiToken}`,
                    },
                });
                const data = response.data["hydra:member"];
                data.forEach((item: any) => {
                    const event = new Event(item.id);
                    event.setBudget(
                        item.budget
                            ? new Budget(
                                  item.budget.id,
                                  item.budget.perUserTotal
                              )
                            : null
                    );
                    event.setEventTitle(item.eventTitle);
                    event.setStartDateTime(item.startDateTime);
                    event.setEndDateTime(item.endDateTime);
                    event.setStartFlightBooking(item.startFlightBooking);
                    event.setEndFlightBooking(item.endFlightBooking);
                    event.setLocation(item.location);
                    event.setOrganization(
                        new Organization(
                            item.organization.id,
                            item.organization.name
                        )
                    );
                });
            }
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
                            organization: this.organization.iri,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${apiToken}`,
                            },
                        }
                    );
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
    id: string;
    iri: string;
    budget: Budget | null = null;
    eventTitle?: string;
    startDateTime?: string; // date-time
    endDateTime?: string; // date-time
    startFlightBooking?: string; // date-time
    endFlightBooking?: string; // date-time
    location?: string;
    organization?: Organization;
    flights?: Flight[];
}
