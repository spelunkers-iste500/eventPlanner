import axios from "axios";
import { User } from "./user";
import { Event } from "./event";

export class Flight {
    id: string;
    flightCost: number = 0;
    event?: Event;
    user?: User;
    departureLocation?: string;
    arrivalLocation?: string;
    departureDateTime?: string;
    arrivalDateTime?: string;
    returnDateTime?: string;
    flightNumber?: string;
    duffelOrderID?: string;
    bookingReference?: string;
    approvalStatus?: string;
    /**
     * @param id the flights UUID
     * @param apiToken the api token to use for authentication
     */
    constructor(id: string, apiToken: string = "") {
        this.id = id;
        if (apiToken !== "") {
            // Fetch the flight data from the API
            this.fetch(apiToken);
        }
    }
    async fetch(apiToken: string): Promise<void> {
        const response = await axios.get(`/flights/${this.id}`, {
            headers: { Authorization: `Bearer ${apiToken}` },
        });
        const data = response.data;
        this.departureLocation = data.departureLocation;
        this.departureDateTime = data.departureDateTime;
        this.arrivalLocation = data.arrivalLocation;
        this.arrivalDateTime = data.arrivalDateTime;
        // optional
        this.returnDateTime = (
            data.returnDateTime ? data.returnDateTime : undefined
        ) as string;
        this.flightNumber = data.flightNumber;
        this.flightCost = data.flightCost;
        this.approvalStatus = data.approvalStatus;
        this.user = new User(data.user.split("/").pop()!); // pop returns the last element of the array, which is the UUID
        this.event = new Event(data.event.split("/").pop()!); // pop returns the last element of the array, which is the UUID
    }
    /**
     *
     * @param apiToken the api token to use for authentication
     */
    async persist(apiToken: string): Promise<void> {
        // the only update to flights should be to approve or decline them
        // other fields should already be set
        try {
            const response = await axios.patch(
                `/flights/${this.id}`,
                {
                    approvalStatus: this.approvalStatus,
                },
                {
                    headers: {
                        Authorization: `Bearer ${apiToken}`,
                        "Content-Type": "application/merge-patch+json",
                    },
                }
            );
        } catch (error) {
            console.error("Error persisting flight data:", error);
            throw new Error("Failed to persist flight data");
        }
    }
    async approve(apiToken: string): Promise<void> {
        this.approvalStatus = "approved";
        await this.persist(apiToken);
    }
    async reject(apiToken: string): Promise<void> {
        this.approvalStatus = "rejected";
        await this.persist(apiToken);
    }

    setFlightCost(value: number) {
        this.flightCost = value;
    }

    setEvent(value: Event | undefined) {
        this.event = value;
    }

    setUser(value: User | undefined) {
        this.user = value;
    }

    setDepartureLocation(value: string | undefined) {
        this.departureLocation = value;
    }

    setArrivalLocation(value: string | undefined) {
        this.arrivalLocation = value;
    }

    setDepartureDateTime(value: string | undefined) {
        this.departureDateTime = value;
    }

    setArrivalDateTime(value: string | undefined) {
        this.arrivalDateTime = value;
    }

    setReturnDateTime(value: string | undefined) {
        this.returnDateTime = value;
    }

    setFlightNumber(value: string | undefined) {
        this.flightNumber = value;
    }

    setDuffelOrderID(value: string | undefined) {
        this.duffelOrderID = value;
    }

    setBookingReference(value: string | undefined) {
        this.bookingReference = value;
    }

    setApprovalStatus(value: string | undefined) {
        this.approvalStatus = value;
    }
}
