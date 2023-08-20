import { Role, Person, DateSpan, Order, Slot } from './types/index';
export * from './types/index';

/**
 * Create Datespans for given roles between a start date and a end date
 * @param roles 
 * @param start 
 * @param end 
 * @returns 
 */
export function createSlots(roles: Array<Role>, start: Date, end: Date) {
    const slots: Array<Slot> = roles.map((r) => {
        let s = new Date(start);
        let results = [];

        do {
            let t = new Date(s);
            // If role starts on Monday it lasts Monday - Sunday (7 days - 1 day)
            t.setDate(t.getDate() + r.duration - 1);
            const result = {
                role:r,
                start: s,
                end: new Date(t)
            };
            // next person takes it on monday
            t.setDate(t.getDate() + 1);
            s = new Date(t);
            results = [...results, result];
        } while(s < end);
        return results;
    }).flat();
    return slots;
}

/**
 * Detects if two date spans overlaps
 * @param d1 
 * @param d2 
 * @returns 
 */
export function datesOverlap(d1: DateSpan, d2: DateSpan) {
    const r = new Date(d1.start) <= new Date(d2.end) && new Date(d1.end) >= new Date(d2.start);
    return r;
}

/**
 * Detects if there is any overlap in a list of spans
 * @param spans 
 * @returns 
 */
export function overlap(spans: Array<DateSpan>) {
    return !!spans.find((s1) => spans.find((s2) => s1 !== s2 && datesOverlap(s1, s2)))
}

/**
 * Return all person affectations for all roles
 * @param order 
 * @returns 
 */
function affectations(order: Order) {
    return Object.values(order).filter((v) => Array.isArray(v)).flat() as Array<DateSpan>;
}

/**
 * Return a date span duration in days (a day started count as a whole)
 * @param d1 
 * @returns 
 */
export function durationInDays(d1: DateSpan) {
    return Math.ceil((d1.end.getTime() - d1.start.getTime()) / 1000 / 60 / 60 / 24);
}

/**
 * Return number of days of presence during a given period of time
 * @param spans 
 * @param d1 
 * @returns 
 */
export function presence(unavailable: Array<DateSpan>, d1: DateSpan) {
    let totalDays = durationInDays(d1);
    unavailable.forEach((d2) => {
        const wD2 = { ...d2 };
        if(!datesOverlap(d1, wD2)) return;
        // reduce dateSpan to only required days
        if(new Date(wD2.start) < new Date(d1.start)) wD2.start = new Date(d1.start);
        if(new Date(wD2.end) > new Date(d1.end)) wD2.end = new Date(d1.end);
        totalDays -= durationInDays(wD2);
    });
    return totalDays;
}

/**
 * Try to assign a slot by favoriting people that did played a role often
 * @param orders 
 * @param slot 
 * @returns 
 */
export function assignFullTime(orders: Array<Order>, slot: Slot) {
    const ordered = [...orders.sort((a, b) => {
        return affectations(a).length - affectations(b).length;
    })];

    let first: Order | undefined;
    let wOrders = [...ordered];
    do {
        first = wOrders.shift();
    } while (first && overlap([...first.person.unavailable, ...affectations(first), slot]));

    if(first) {
        (first[slot.role.name] as Array<DateSpan>).push(slot);
    }

    return first;
}

/**
 * Try to assign no-fulltime role slot by favoriting people than are present most of the time for the given period of time 
 * @param orders 
 * @param slot 
 * @returns 
 */
export function assignMostTime(orders: Array<Order>, slot: Slot) {
    if(slot.role.fullTime) return null;
    const ordered = [...orders.sort((a, b) => {
        const daysAvailableA = presence([...a.person.unavailable, ...affectations(a)], slot);
        const daysAvailableB = presence([...b.person.unavailable, ...affectations(b)], slot);
        (a as any).days = daysAvailableA;
        (b as any).days = daysAvailableB;
        return daysAvailableB - daysAvailableA;
    })];

    const slotDuration = durationInDays(slot);

    let first: Order | undefined;
    let wOrders = [...ordered];
    do {
        first = wOrders.shift();
        // here wont dont look at vaccations, we only want the person to be there most of the time
    } while (first && (slotDuration - presence([...first.person.unavailable, ...affectations(first)], slot)) < slotDuration / 2);

    if(first) {
        (first[slot.role.name] as Array<DateSpan>).push(slot);
    }

    return first;
}

/**
 * Assign the givens slot to the given people, and returns the slot it failed to assign
 * as they should be assigned manually
 * @param orders 
 * @param slots 
 */
export function assign(orders: Array<Order>, slots: Array<Slot>) {
    // fist assign all the slots full time 
    const partTimeSlots = slots.filter((slot) => !assignFullTime(orders, slot));
    // then we try to see if the remaining slots can be assigned in parttime
    const remainingSlots = partTimeSlots.filter((slot) => !assignMostTime(orders, slot));

    if(remainingSlots.length > 0) {
        console.error(remainingSlots);
    }
}


export function round(start: Date, end: Date, team: Array<Person>, roles: Array<Role>) {
    // we init an array associate persons with number of times they were affected
    const order: Array<Order> = team.map((p) => ({
        person: p,
        ...roles.reduce((acc, role) => { 
            return {
                ...acc,
                [role.name]: [],
            }
        }, {})
    }));

    const slots = createSlots(roles, start, end);
    assign(order, slots);
}
