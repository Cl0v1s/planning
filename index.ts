import { Role } from './types/Role';

import {
    start as startRaw,
    end as endRaw,
    team as teamRaw,
    roles as rolesRaw
} from './config.json';
import { Person } from './types/Person';
import { DateSpan } from './types/DateSpan';

import * as readline from 'node:readline/promises';
import { exit, stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

type Order = {
    [roleName: string]: Array<DateSpan> | Person,
    person: Person,
}

interface Slot extends DateSpan {
    role: Role,
}

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

export async function assign(orders: Array<Order>, slot: Slot) {
    const ordered = [...orders.sort((a, b) => {
        const affectationsA = a[slot.role.name] as Array<DateSpan>;
        const affectationsB = b[slot.role.name] as Array<DateSpan>;
        return affectationsA.length - affectationsB.length;
    })];

    let first: Order | undefined;
    let wOrders = [...ordered];
    do {
        first = wOrders.shift();
    } while (first && overlap([...first.person.unavailable, ...affectations(first), slot]));

    if(first == null) {
        const availables = orders.filter((o) => !overlap([...o.person.unavailable, slot]));
        if(availables.length === 0) {
            console.error('The planning is impossible with the given timings.');
            console.error('Unable to affect slot', JSON.stringify(slot, null, 2));
            exit(1);
        } else if (availables.length === 1) {
            first = availables[0];
            console.warn(`${first.person.name} will have two roles at the same time around the following dates:`)
            console.warn(`${slot.start.toLocaleDateString()} - ${slot.end.toLocaleDateString()}`);
        } else {
            console.log(JSON.stringify(availables, null, 2));
            const prompt = `Who should take the role ${slot.role.name} between ${slot.start.toLocaleDateString()} - ${slot.end.toLocaleDateString()}\n\n
            ${availables.map((o, index) => `${index}. ${o.person.name}`).join(' - ')}`
            const answer = await rl.question(prompt);
        }
    }

    if(first) {
        (first[slot.role.name] as Array<DateSpan>).push(slot);
    }

    return first;



    // // we found nobody with the given rules we ask for user to select someone
    // if(first == null) {
    //     const available = originalOrdered.filter((order) => !overlap([...order.person.unavailable, slot]));

    //     available.forEach((order, index) => {
    //         console.log(`${index}. ${order.person.name} Same role turns: ${order.affectations.find((a) => a.role.name == slot.role.name).spans.length} In the same time: ${order.affectations.map((a) => a.spans.filter((s) => datesOverlap(slot, s))).flat().length}`)
    //     })

    // }


    // if(first) first.affectations.find((af) => af.role === slot.role)?.spans.push({ start: slot.start, end: slot.end });

    // return first;
}


async function createRound(start: Date, end: Date, team: Array<Person>, roles: Array<Role>) {
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
    console.log(JSON.stringify(slots, undefined, 2))
    await Promise.all(slots.map((s) => assign(order, s)));
    console.log(JSON.stringify(order, null, 2));
    exit(0);
}

createRound(new Date(startRaw), new Date(endRaw), teamRaw.map((p) => new Person(p)), [...rolesRaw])