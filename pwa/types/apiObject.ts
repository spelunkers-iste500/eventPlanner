interface ApiObject {
    id: string;
    fetch(): Promise<void>;
    persist(): Promise<void>;
    allFromApiResponse(apiToken: string): Promise<ApiObject[]>;
    fromApiResponse(id: string, apiToken: string): Promise<ApiObject>;
    getName(): string;
    getIri(): string;
}