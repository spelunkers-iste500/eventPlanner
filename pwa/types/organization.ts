export class Organization {
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this["@id"] = id;
        this.iri = `/organizations/${id}`;
    }
    id: string;
    name: string;
    ["@id"]: string;
    iri: string;
}
