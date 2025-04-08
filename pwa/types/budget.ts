import axios from "axios";
import { Organization } from "./organization";
import { Event } from "./event";

export class Budget {
    id: string;
    perUserTotal?: number;
    organization?: Organization;
    event?: Event;
    overage?: number;
    constructor(id: string = "notPersisted", apiToken: string = "") {
        this.id = id;
        if (apiToken !== "" && id == "notPersisted") {
            throw new Error("Cannot fetch budget data without an ID");
        } else if (apiToken !== "" && id !== "notPersisted") {
            // Fetch the budget data from the API
            this.fetch(apiToken);
        }
    }
    async fetch(apiToken: string): Promise<void> {
        const response = await axios.get(`/budgets/${this.id}`, {
            headers: { Authorization: `Bearer ${apiToken}` },
        });
        const data = response.data;
        this.organization = new Organization(
            data.organization.split("/").pop()! // pop returns the last element of the array, which is the UUID
        );
        this.perUserTotal = data.perUserTotal;
        this.event = new Event(data.event.split("/").pop()!); // pop returns the last element of the array, which is the UUID
        this.overage = data.overage;
    }
    async persist(apiToken: string): Promise<void> {
        // two cases: creating a budget (id = "notPersisted") or updating an existing one (id != "notPersisted")
        if (this.id === "notPersisted") {
            // check if the required fields are set: organization, perUserTotal, overage, event
            if (!this.organization) {
                throw new Error("Organization is required");
            }
            if (!this.perUserTotal) {
                throw new Error("Per user total is required");
            }
            if (!this.event) {
                throw new Error("Event is required");
            }
            if (!this.overage) {
                throw new Error("Overage is required");
            }

            // Create a new budget
            const response = await axios.post(
                `/budgets`,
                {
                    organization: `/organizations/${this.organization.id}`,
                    event: `/events/${this.event.id}`,
                    overage: this.overage,
                    perUserTotal: this.perUserTotal,
                },
                {
                    headers: {
                        Authorization: `Bearer ${apiToken}`,
                        "Content-Type": "application/ld+json",
                        accept: "application/ld+json",
                    },
                }
            );
            this.id = response.data.id;
        } else {
            // Update an existing budget
            await axios.put(
                `/budgets/${this.id}`,
                {
                    perUserTotal: this.perUserTotal,
                    overage: this.overage,
                },
                {
                    headers: { Authorization: `Bearer ${apiToken}` },
                }
            );
        }
    }
}
