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
    invites: {
        id: string;
        status: boolean;
        expectedEmail: string;
        inviteType: string;
    }[] = [];
    /**
     * Constructs a new object. Optionally, the ID of an existing organization can be provided to fetch the details from the API if it is accompanied by the API token.
     * @param id The requested organizations ID
     * @param apiToken The users API Token. When provided, the details for the object are fetched from the API, overwriting whatever has been set.
     */
    constructor(id: string = "notPersisted", apiToken: string = "") {
        this.id = id.split("/").length > 1 ? id.split("/").pop()! : id;
        if (apiToken !== "" && id == "notPersisted") {
            throw new Error("Cannot fetch organization data without an ID");
        } else if (apiToken !== "" && id !== "notPersisted") {
            // Fetch the organization data from the API
            this.fetch(apiToken);
        }
    }
    async fetch(apiToken: string): Promise<void> {
        const response = await axios.get(`/organizations/${this.id}`, {
            headers: {
                Authorization: `Bearer ${apiToken}`,
                Accept: "application/ld+json",
            },
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
        this.eventAdmins = data.eventadmins.map((user: any) => {
            return new User(user.split("/").pop()!);
        });
        this.fullAdmins = data.admins.map((user: any) => {
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
                    eventadmins: this.eventAdmins
                        ? this.eventAdmins.map((user) => user.id)
                        : [],
                    admins: this.fullAdmins
                        ? this.fullAdmins.map((user) => user.id)
                        : [],
                },
                {
                    headers: {
                        Authorization: `Bearer ${apiToken}`,
                        Accept: "application/ld+json",
                        "Content-Type": "application/ld+json",
                    },
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
                    eventadmins: this.eventAdmins
                        ? this.eventAdmins.map((user) => user.id)
                        : [],
                    fullAdmins: this.fullAdmins
                        ? this.fullAdmins.map((user) => user.id)
                        : [],
                },
                {
                    headers: {
                        Authorization: `Bearer ${apiToken}`,
                        "Content-Type": "application/merge-patch+json",
                    },
                }
            );
        }
    }
    static async fromApiResponse(
        id: string,
        apiToken: string
    ): Promise<Organization> {
        const response = await axios.get(`/organizations/${id}`, {
            headers: { Authorization: `Bearer ${apiToken}` },
        });
        const data = response.data;
        const organization = new Organization(id);
        organization.name = data.name;
        organization.description = data.description;
        organization.address = data.address;
        organization.industry = data.industry;
        // user will be in the form of an IRI here
        organization.financeAdmins = data.financeAdmins.map((user: any) => {
            return new User(user.split("/").pop()!);
        });
        organization.eventAdmins = data.eventAdmins.map((user: any) => {
            return new User(user.split("/").pop()!);
        });
        organization.fullAdmins = data.admins.map((user: any) => {
            return new User(user.split("/").pop()!);
        });
        return organization;
    }
    static async allFromApiResponse(apiToken: string): Promise<Organization[]> {
        const response = await axios.get(`/my/organizations`, {
            headers: { Authorization: `Bearer ${apiToken}` },
        });
        const data = response.data["hydra:member"];
        return data.map((org: any) => {
            const orgObj = new Organization(org.id);
            orgObj.name = org.name;
            orgObj.description = org.description;
            orgObj.address = org.address;
            orgObj.industry = org.industry;
            orgObj.financeAdmins = org.financeAdmins.map((user: any) => {
                return new User(user.split("/").pop()!);
            });
            orgObj.eventAdmins = org.eventadmins.map((user: any) => {
                return new User(user.split("/").pop()!);
            });
            orgObj.fullAdmins = org.admins.map((user: any) => {
                return new User(user.split("/").pop()!);
            });
            org.invites
                ? (orgObj.invites = org.invites.map((invite: any) => {
                      return {
                          id: invite.id,
                          status: invite.status,
                          expectedEmail: invite.expectedEmail,
                          inviteType: invite.inviteType,
                      };
                  }))
                : (orgObj.invites = []);
            return orgObj;
        });
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
    setName(name: string): void {
        this.name = name;
    }

    setDescription(description: string): void {
        this.description = description;
    }

    setAddress(address: string): void {
        this.address = address;
    }

    setIndustry(industry: string): void {
        this.industry = industry;
    }

    getIri(): string {
        return `/organizations/${this.id}`;
    }
    getName(): string {
        return this.name ? this.name : "undefined";
    }
    setInvites(
        invites: {
            id: string;
            status: boolean;
            expectedEmail: string;
            inviteType: string;
        }[]
    ): void {
        this.invites = invites;
    }
    getInvites(): {
        id: string;
        status: boolean;
        expectedEmail: string;
        inviteType: string;
    }[] {
        return this.invites;
    }
}
