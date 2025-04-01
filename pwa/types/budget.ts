import axios from "axios";
import { Organization } from "./organization";

export class Budget {
    constructor(id: string, perUserTotal: number) {
        this.id = id;
        this.perUserTotal = perUserTotal;
    }
    /**
     * Fetches the budgets for each organization the user is a finance admin of
     * @param apiToken users api token
     * @param organizations the list of organizations the user is a finance admin of
     * @returns a promise that resolves to a list of budgets
     */
    static fromApiResponse(
        apiToken: string,
        organizations: Organization[]
    ): Promise<Budget[]> {
        try {
            const budgets = organizations.map(async (org) => {
                const response = await axios.get(
                    `/organizations/${org.id}/budget`,
                    {
                        headers: {
                            Authorization: `Bearer ${apiToken}`,
                        },
                    }
                );
                return new Budget(response.data.id, response.data.perUserTotal);
            });
            return Promise.all(budgets);
        } catch (error) {
            console.error("Error fetching budget data:", error);
            throw error;
        }
    }
    async persist(): Promise<void> {}
    id: string;
    perUserTotal: number;
}
