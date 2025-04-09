import axios from "axios";
import { Organization } from "./organization";
import { UserEvent } from "./userEvent";
import { headers } from "next/headers";
export class User {
    static url = "/my/user";
    id: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    email?: string;
    emailVerified?: boolean;
    phoneNumber?: string;
    birthday?: string;
    title?: string;
    gender?: string;
    eventAdminOfOrg: Organization[] = [];
    financeAdminOfOrg: Organization[] = [];
    adminOfOrg: Organization[] = [];
    superAdmin?: boolean;
    passengerId?: string;
    plainPassword?: string;
    setFirstName(firstName: string): void {
        this.firstName = firstName;
    }

    setLastName(lastName: string): void {
        this.lastName = lastName;
    }

    setName(name: string): void {
        this.name = name;
        this.firstName = name.split(" ")[0];
        this.lastName = name.split(" ")[1];
    }

    setEmail(email: string): void {
        this.email = email;
    }

    setEmailVerified(emailVerified: boolean): void {
        this.emailVerified = emailVerified;
    }

    setPhoneNumber(phoneNumber: string): void {
        this.phoneNumber = phoneNumber;
    }

    setBirthday(birthday: string): void {
        this.birthday = birthday;
    }

    setTitle(title: string): void {
        this.title = title;
    }

    setGender(gender: string): void {
        this.gender = gender;
    }

    setEventAdminOfOrg(eventAdminOfOrg: Organization[]): void {
        this.eventAdminOfOrg = eventAdminOfOrg;
    }

    setFinanceAdminOfOrg(financeAdminOfOrg: Organization[]): void {
        this.financeAdminOfOrg = financeAdminOfOrg;
    }

    setSuperAdmin(superAdmin: boolean): void {
        this.superAdmin = superAdmin;
    }

    setPassengerId(passengerId: string): void {
        this.passengerId = passengerId;
    }
    setAdminOfOrg(adminOfOrg: Organization[]): void {
        this.adminOfOrg = adminOfOrg;
    }
    constructor(id: string = "notPersisted", apiToken: string = "") {
        this.id = id;
        if (apiToken !== "" && id !== "notPersisted") {
            this.fetch(apiToken);
        }
    }
    /**
     * Fetches user data from the API and creates a User object.
     * @param {string} apiToken - The API token for authentication.
     * @returns {Promise<User>} - A promise that resolves to a User object.
     */
    static async fromApiResponse(
        id: string = "",
        apiToken: string
    ): Promise<User> {
        try {
            const uri = id === "" ? `/my/user` : `/users/${id}`;
            const response = await axios.get(uri, {
                headers: {
                    "Content-Type": "application/ld+json",
                    Authorization: "Bearer " + apiToken,
                },
            });
            const data = response.data;
            // create a new User object using the data from the API response
            const user = new User(data.id, apiToken);
            user.setName(data.name);
            user.email = data.email;
            user.emailVerified = data.emailVerified;
            user.phoneNumber = data.phoneNumber;
            user.birthday = data.birthday;
            user.title = data.title;
            user.gender = data.gender;
            user.eventAdminOfOrg = data.eventAdminOfOrg.map((org: any) => {
                const orgObj = new Organization(org["@id"].split("/").pop());
                orgObj.name = org.name;
                return orgObj;
            });
            user.financeAdminOfOrg = data.financeAdminOfOrg.map((org: any) => {
                const orgObj = new Organization(org["@id"].split("/").pop());
                orgObj.name = org.name;
                return orgObj;
            });
            user.adminOfOrg = data.AdminOfOrg.map((org: any) => {
                const orgObj = new Organization(org["@id"].split("/").pop());
                orgObj.name = org.name;
                return orgObj;
            });
            user.adminOfOrg = data.AdminOfOrg.map((org: any) => {
                return new Organization(org.id);
            });
            user.superAdmin = data.superAdmin;
            user.passengerId = data.passengerId;
            return user;
        } catch (error) {
            console.error("Error fetching user data:", error);
            throw new Error("Failed to fetch user data");
        }
    }
    /**
     * Sends an API request to update the user data.
     * @remark This method will only update the users name, email, phoneNumber, title, and gender.
     * @param {string} apiToken - The API token for authentication.
     * @returns {Promise<void>} - A promise that resolves when the update is successful.
     */
    async persist(
        apiToken: string,
        eventCode: string = "",
        userOrgInviteId: string = ""
    ): Promise<void> {
        try {
            if (this.id === "notPersisted") {
                // this is used when registering the user
                await axios.post("/user", {
                    headers: {
                        "Content-Type": "application/ld+json",
                    },
                    data: {
                        firstName: this.name?.split(" ")[0],
                        lastName: this.name?.split(" ")[1],
                        email: this.email,
                        phoneNumber: this.phoneNumber,
                        birthday: this.birthday,
                        title: this.title,
                        gender: this.gender,
                        plainPassword: this.plainPassword,
                        eventCode: eventCode !== "" ? eventCode : null,
                        userOrgInviteId:
                            userOrgInviteId !== "" ? userOrgInviteId : null,
                    },
                });
            } else {
                await axios.patch(`/user/${this.id}`, {
                    headers: {
                        Authorization: "Bearer " + apiToken,
                        "Content-Type": "application/ld+json",
                    },
                    data: {
                        name: this.name,
                        email: this.email,
                        phoneNumber: this.phoneNumber,
                        title: this.title,
                        gender: this.gender,
                    },
                });
            }
        } catch (error) {
            console.error("Error updating user data:", error);
            throw new Error("Failed to update user data");
        }
    }
    /**
     * Fetches user data from the API and updates the User object.
     * @param {string} apiToken - The API token for authentication.
     * @returns {Promise<User>} - A promise that resolves when the update is successful.
     */
    async fetch(apiToken: string): Promise<User> {
        if (this.id === "notPersisted") {
            throw new Error("User ID is not set");
        }
        try {
            var uri = "";
            if (this.id == "self") {
                uri = `/my/user`;
            } else {
                uri = `/users/${this.id}`;
            }
            const response = await axios.get(uri, {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                },
            });
            const data = response.data;
            // Update the instance properties with the fetched data
            this.id = data.id;
            this.setName(data.name);
            this.email = data.email;
            this.emailVerified = data.emailVerified;
            this.phoneNumber = data.phoneNumber;
            this.birthday = data.birthday;
            this.title = data.title;
            this.gender = data.gender;
            this.eventAdminOfOrg = data.eventAdminOfOrg.map((org: any) => {
                const orgObj = new Organization(org["@id"].split("/").pop());
                orgObj.name = org.name;
                return orgObj;
            });
            this.financeAdminOfOrg = data.financeAdminOfOrg.map((org: any) => {
                const orgObj = new Organization(org["@id"].split("/").pop());
                orgObj.name = org.name;
                return orgObj;
            });
            this.adminOfOrg = data.AdminOfOrg.map((org: any) => {
                const orgObj = new Organization(org["@id"].split("/").pop());
                orgObj.name = org.name;
                return orgObj;
            });
            this.adminOfOrg = data.AdminOfOrg.map((org: any) => {
                return new Organization(org["@id"].split("/").pop());
            });
            this.superAdmin = data.superAdmin;
            this.passengerId = data.passengerId;
            return this;
        } catch (error) {
            console.error("Error fetching user data:", error);
            throw error;
        }
    }
    getIri(): string {
        return `/users/${this.id}`;
    }
    getEmail(): string {
        return this.email || "";
    }
}
