import { Person } from "./Person";
import { Role } from "./Role";

export interface RoundRole {
    start?: Date,
    end?: Date,
    role: Role,
    person: Person,
    duration: number,
}