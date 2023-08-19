import { DateSpan } from './DateSpan';
import { RoundRole } from './RoundRole';
export interface Round extends DateSpan {
    roles: Array<RoundRole>
}