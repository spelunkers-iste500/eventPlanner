import axios from "axios";
import { User } from "./user";
export class Organization {
    id: string;
    name?: string;
    description?: string;
    address?: string;
    industry?: string;
    financeAdmins?: User[];
    eventAdmins?: User[];
    fullAdmins?: User[];
    constructor(id: string = "notPersisted", apiToken: string = "") {
        this.id = id;
        if (apiToken !== "" && id == "notPersisted") {
            throw new Error("Cannot fetch organization data without an ID");
        } else if (apiToken === "" && id !== "notPersisted") {
            // Fetch the organization data from the API
            this.fetch(apiToken);
        }
    }
    async fetch(apiToken: string): Promise<void> {
        const response = await axios.get(`/organizations/${this.id}`, {
            headers: { Authorization: `Bearer ${apiToken}` },
        });
        const data = response.data;
        this.name = data.name;
        this.description = data.description;
        this.address = data.address;
        this.industry = data.industry;
        // user will be in the form of an IRI here
        this.financeAdmins = data.financeAdmins.map((user: any) => {
            return new User(user.split("/").pop()!);
        });
        this.eventAdmins = data.eventAdmins.map((user: any) => {
            return new User(user.split("/").pop()!);
        });
        this.fullAdmins = data.fullAdmins.map((user: any) => {
            return new User(user.split("/").pop()!);
        });
    }
    async persist(apiToken: string): Promise<void> {
        // two cases: creating an organization (id = "notPersisted") or updating an existing one (id != "notPersisted")
        if (this.id === "notPersisted") {
            // Create a new organization
            const response = await axios.post(
                `/organizations`,
                {
                    name: this.name,
                    description: this.description,
                    address: this.address,
                    industry: this.industry,
                    financeAdmins: this.financeAdmins
                        ? this.financeAdmins.map((user) => user.id)
                        : [],
                    eventAdmins: this.eventAdmins
                        ? this.eventAdmins.map((user) => user.id)
                        : [],
                    fullAdmins: this.fullAdmins
                        ? this.fullAdmins.map((user) => user.id)
                        : [],
                },
                {
                    headers: { Authorization: `Bearer ${apiToken}` },
                }
            );
            this.id = response.data.id; // check to see if the id is set in the response
        } else if (this.id) {
            // Update an existing organization
            await axios.patch(
                `/organizations/${this.id}`,
                {
                    name: this.name,
                    description: this.description,
                    address: this.address,
                    industry: this.industry,
                    financeAdmins: this.financeAdmins
                        ? this.financeAdmins.map((user) => user.id)
                        : [],
                    eventAdmins: this.eventAdmins
                        ? this.eventAdmins.map((user) => user.id)
                        : [],
                    fullAdmins: this.fullAdmins
                        ? this.fullAdmins.map((user) => user.id)
                        : [],
                },
                {
                    headers: { Authorization: `Bearer ${apiToken}` },
                }
            );
        }
    }
    addFinanceAdmin(user: User): void {
        if (!this.financeAdmins) {
            this.financeAdmins = [];
        }
        this.financeAdmins.push(user);
    }
    addEventAdmin(user: User): void {
        if (!this.eventAdmins) {
            this.eventAdmins = [];
        }
        this.eventAdmins.push(user);
    }
    addFullAdmin(user: User): void {
        if (!this.fullAdmins) {
            this.fullAdmins = [];
        }
        this.fullAdmins.push(user);
    }
    removeFinanceAdmin(user: User): void {
        if (!this.financeAdmins) {
            return;
        }
        this.financeAdmins = this.financeAdmins.filter(
            (admin) => admin.id !== user.id
        );
    }
    removeEventAdmin(user: User): void {
        if (!this.eventAdmins) {
            return;
        }
        this.eventAdmins = this.eventAdmins.filter(
            (admin) => admin.id !== user.id
        );
    }
    removeFullAdmin(user: User): void {
        if (!this.fullAdmins) {
            return;
        }
        this.fullAdmins = this.fullAdmins.filter(
            (admin) => admin.id !== user.id
        );
    }
}
