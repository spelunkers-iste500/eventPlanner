import axios from "axios";
import { Organization } from "./organization";
export class User {
    static url = '/my/user';
    id: string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    emailVerified: boolean;
    phoneNumber: string;
    birthday: string;
    title: string;
    gender: string;
    eventsAttending: Event[];
    eventAdminOfOrg: Organization[];
    financeAdminOfOrg: Organization[];
    superAdmin: boolean;
    passengerId: string;
    constructor(
        id: string,
        firstName: string,
        lastName: string,
        email: string,
        emailVerified: boolean,
        phoneNumber: string,
        birthday: string,
        title: string,
        gender: string,
        eventsAttending: Event[],
        eventAdminOfOrg: Organization[],
        financeAdminOfOrg: Organization[],
        superAdmin: boolean,
        passengerId: string
        ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.name = firstName + " " + lastName;
        this.email = email;
        this.emailVerified = emailVerified;
        this.phoneNumber = phoneNumber;
        this.birthday = birthday;
        this.title = title;
        this.gender = gender;
        this.eventsAttending = eventsAttending;
        this.eventAdminOfOrg = eventAdminOfOrg;
        this.financeAdminOfOrg = financeAdminOfOrg;
        this.superAdmin = superAdmin;
        this.passengerId = passengerId;
    }
    /**
     * Fetches user data from the API and creates a User object.
     * @param {string} apiToken - The API token for authentication.
     * @returns {Promise<User>} - A promise that resolves to a User object.
    */
    static async fromApiResponse(apiToken: string): Promise<User> {
        try {
            const response = await axios.get(this.url, {
                headers: {
                    "Content-Type": "application/ld+json",
                    Authorization: "Bearer " + apiToken,
                },
            })
            const data = response.data;
            // create a new User object using the data from the API response
            const user = new User(
                data.id,
                data.name.split(" ")[0],
                data.name.split(" ")[1],
                data.email,
                data.emailVerified,
                data.phoneNumber,
                data.birthday,
                data.title,
                data.gender,
                data.eventsAttending,
                data.eventAdminOfOrg,
                data.financeAdminOfOrg,
                data.superAdmin,
                data.passengerId
            );
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
    async update(apiToken: string): Promise<void> {
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
            }
        })} catch (error) {
            console.error("Error updating user data:", error);
            throw new Error("Failed to update user data");
        }
    }

}