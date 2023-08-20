import { DateSpan } from "./DateSpan"
import { Person } from "./Person"

export type Order = {
    [roleName: string]: Array<DateSpan> | Person,
    person: Person,
}