import axios from "axios";
import { Organization } from "./organization";
import { UserEvent } from "./userEvent";
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
    eventAdminOfOrg?: Organization[];
    financeAdminOfOrg?: Organization[];
    superAdmin?: boolean;
    passengerId?: string;
    setFirstName(firstName: string): void {
        this.firstName = firstName;
    }

    setLastName(lastName: string): void {
        this.lastName = lastName;
    }

    setName(name: string): void {
        this.name = name;
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
    constructor(id: string = "notPersisted", apiToken: string = "") {
        this.id = id;
        if (apiToken !== "" && id == "notPersisted") {
            this.fetch(apiToken);
        }
    }
    /**
     * Fetches user data from the API and creates a User object.
     * @param {string} apiToken - The API token for authentication.
     * @returns {Promise<User>} - A promise that resolves to a User object.
     */
    static async fromApiResponse(id: string, apiToken: string): Promise<User> {
        try {
            const response = await axios.get(`/users/${id}`, {
                headers: {
                    "Content-Type": "application/ld+json",
                    Authorization: "Bearer " + apiToken,
                },
            });
            const data = response.data;
            // create a new User object using the data from the API response
            const user = new User(data.id, apiToken);
            user.firstName = data.firstName;
            user.lastName = data.lastName;
            user.name = data.name;
            user.email = data.email;
            user.emailVerified = data.emailVerified;
            user.phoneNumber = data.phoneNumber;
            user.birthday = data.birthday;
            user.title = data.title;
            user.gender = data.gender;
            user.eventAdminOfOrg = data.eventAdminOfOrg.map((org: any) => {
                return new Organization(org.id);
            });
            user.financeAdminOfOrg = data.financeAdminOfOrg.map((org: any) => {
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
    async persist(apiToken: string): Promise<void> {
        if (!this.id) {
            throw new Error("Malformed User object: ID not set");
        }
        try {
            axios.patch(`/user/${this.id}`, {
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
        } catch (error) {
            console.error("Error updating user data:", error);
            throw new Error("Failed to update user data");
        }
    }
    /**
     * Fetches user data from the API and updates the User object.
     * @param {string} apiToken - The API token for authentication.
     * @returns {Promise<void>} - A promise that resolves when the update is successful.
     */
    async fetch(apiToken: string): Promise<void> {
        if (this.id === "notPersisted") {
            throw new Error("User ID is not set");
        }
        try {
            const response = await axios.get(`/user/${this.id}`, {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                },
            });
            const data = response.data;
            // Update the instance properties with the fetched data
            this.firstName = data.firstName;
            this.lastName = data.lastName;
            this.name = data.name;
            this.email = data.email;
            this.emailVerified = data.emailVerified;
            this.phoneNumber = data.phoneNumber;
            this.birthday = data.birthday;
            this.title = data.title;
            this.gender = data.gender;
            this.eventAdminOfOrg = data.eventAdminOfOrg;
            this.financeAdminOfOrg = data.financeAdminOfOrg;
            this.superAdmin = data.superAdmin;
            this.passengerId = data.passengerId;
        } catch (error) {
            console.error("Error fetching user data:", error);
            throw error;
        }
    }
}
