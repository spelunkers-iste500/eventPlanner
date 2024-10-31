import { Item } from "./item";

export class Author implements Item {
  public "@id"?: string;

  constructor(_id?: string, public name?: string, public books?: string[]) {
    this["@id"] = _id;
  }
}
