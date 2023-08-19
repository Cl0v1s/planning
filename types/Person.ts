import { DateSpan } from "./DateSpan";

export class Person {
    /**
     * Person's name
     */
    name: string;
    /**
     * Periods of unavailability
     */
    unavailable: Array<DateSpan>;

    constructor({name, unavailable}) {
        this.name = name;
        this.unavailable = unavailable.map((u) => ({ start: new Date(u.start), end: new Date(u.end)}))
    }
}