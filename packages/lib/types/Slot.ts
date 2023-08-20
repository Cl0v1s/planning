import { DateSpan } from "./DateSpan";
import { Role } from "./Role";

export interface Slot extends DateSpan {
    role: Role,
}