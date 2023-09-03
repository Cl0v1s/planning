const Jest = require('@jest/globals');

import { DateSpan } from "./types/DateSpan";
import { Order } from "./types/Order";

import { datesOverlap, overlap, createSlots, presence, durationInDays, assignFullTime, createOrders, affectations, Person } from './index';
import { Role } from "./types/Role";

describe("Test datesOverlap", () => {
    const s1 = {start: new Date("2023-01-01"), end: new Date("2023-01-03")};
    const s2 = {start: new Date("2023-01-04"), end: new Date("2023-01-06")};

    const d1 = {start: new Date("2023-01-05"), end: new Date("2023-01-08")};

    test("overlap", () => {
        Jest.expect(
            datesOverlap(s2, d1)
        ).toBeTruthy();
    });

    test("Don't overlap", () => {
        Jest.expect(
            datesOverlap(s1, s2)
        ).toBeFalsy();
    });

    test("overlap same date", () => {
        Jest.expect(
            datesOverlap(s1, s1)
        ).toBeTruthy();
        const z = JSON.parse(JSON.stringify(s1));
        Jest.expect(
            datesOverlap(z, s1)
        ).toBeTruthy();
    });

});

describe("Test overlap", () => {
    const s1 = {start: new Date("2023-01-01"), end: new Date("2023-01-03")};
    const s2 = {start: new Date("2023-01-04"), end: new Date("2023-01-06")};
    const s3 = {start: new Date("2023-01-07"), end: new Date("2023-01-09")};

    const d1 = {start: new Date("2023-01-05"), end: new Date("2023-01-08")};

    test("Don't overlap", () => {
        Jest.expect(
            overlap([s1, s2, s3])
        ).toBeFalsy();
    });

    test("overlap", () => {
        Jest.expect(
            overlap([s1, s2, s3, d1])
        ).toBeTruthy();
    });

});

describe("Test createSlots", () => {
    const roles: Array<Role> = [
        {
            "name": "Track debug",
            "duration": 14,
            fullTime: true,
        },
        {
            "name": "Referrer",
            "duration": 14,
            fullTime: false,
        }
    ];
    const start = new Date(2023, 6, 31);
    const end = new Date(2023, 8, 30);
    const slots = createSlots(roles, start, end);
    
    const td = slots.filter((s) => s.role.name !== roles[0].name);
    const ref = slots.filter((s) => s.role.name !== roles[1].name);

    test("Good slots number", () => {
        expect(td.length).toBe(5);
        expect(ref.length).toBe(5);
    });

    test("Coherent timeline", () => {
        for(let i = 1; i < td.length; i++) {
            const s = new Date(td[i].start)
            s.setDate(s.getDate() - 1);
            expect(td[i-1].end.getTime()).toBe(s.getTime());
        }

        for(let i = 1; i < ref.length; i++) {
            const s = new Date(ref[i].start);
            s.setDate(s.getDate() - 1);
            expect(ref[i-1].end.getTime()).toBe(s.getTime());
        }
    })
});

describe("Test DurationInDays", () => {
    const timePeriod1: DateSpan = {
        start: new Date("2023-07-31T22:00:00.000Z"),
        end: new Date("2023-08-04T08:00:00.000Z")
    }
    test('Check morning', () => {
        expect(
            durationInDays(timePeriod1)
        ).toBe(
            4
        )
    });

    const timePeriod2 = {
        start: new Date("2023-07-31T22:00:00.000Z"),
        end: new Date("2023-08-04T18:00:00.000Z")
    }

    test('Check evening', () => {
        expect(
            durationInDays(timePeriod2)
        ).toBe(
            4
        )
    });

    const timePeriod3 = {
        start: new Date("2023-07-31T22:00:00.000Z"),
        end: new Date("2023-08-04T22:01:00.000Z")
    }

    test('Check 0h01', () => {
        expect(
            durationInDays(timePeriod3)
        ).toBe(
            5
        )
    });
});

describe("Test Presence", () => {
    const alwaysHere: Order = {
        person: {
            "name":"Testy",
            "unavailable": []
        },
    };

    const absentSomeDays: Order = {
        person: {
            "name": "Testy",
            "unavailable": [
                {
                    "start": new Date("2023-07-30T22:00:00.000Z"),
                    "end": new Date("2023-08-03T22:00:00.000Z")
                }
            ]
        }
    }

    const timePeriod: DateSpan = {
        start: new Date("2023-07-30T22:00:00.000Z"),
        end: new Date("2023-08-12T22:00:00.000Z")
    }

    test('Check always here', () => {
        expect(
            presence(alwaysHere.person.unavailable, timePeriod)
        ).toBe(
            durationInDays(timePeriod)
        )
    });

    test('Check absent 4 days', () => {
        expect(
            presence(absentSomeDays.person.unavailable, timePeriod)
        ).toBe(
            durationInDays(timePeriod) - durationInDays(absentSomeDays.person.unavailable[0])
        )
    });
});

describe('test assign', () => {
    const roles = [
        {
            "name": "Track debug",
            "duration": 14,
            "fullTime": true
        },
        {
            "name": "Referrer",
            "duration": 14,
            "fullTime": false
        }
    ];
    const team = [
        {
            "name":"Stella",
            "unavailable": [
                
            ]
        },
        {
            "name":"Pierre",
            "unavailable": [
                
            ]
        },
        {
            "name":"Matthieu",
            "unavailable": [
                
            ]
        },
        {
            "name":"Clovis",
            "unavailable": [
                
            ]
        }
    ];

    test('simple assign full time', () => {
        const wRoles = [roles[0]];
        const slots = createSlots(wRoles, new Date('2023-01-01'), new Date('2023-01-31'));
        const orders = createOrders(team, wRoles);
       const remainingSlots = slots.filter((s) => !assignFullTime(orders, s));
       const oRoles = orders.map((o) => (o[wRoles[0].name] as Array<DateSpan>));
       // all slots affected
       expect(remainingSlots.length).toBe(0);
       expect(oRoles.flat().length).toBe(slots.length);
       // nobody been affected twice
       expect(
        oRoles.filter((o) => o.length > 1).length
       ).toBe(0)
    });

    test('simple assign full time with two roles', () => {
        const slots = createSlots(roles, new Date('2023-01-01'), new Date('2023-01-31'));
        const orders = createOrders(team, roles);
        const remainingSlots = slots.filter((s) => !assignFullTime(orders, s));
        const affcts = orders.map((o) => affectations(o));
        // all slots affected
        expect(remainingSlots.length).toBe(0);
        expect(affcts.flat().length).toBe(slots.length);
        // nobody been affected too much
        expect(
        affcts.filter((o) => o.length > 2).length
        ).toBe(0)
    });

    test('assign with unavailability', () => {
        const wTeam = [
            ...team.filter((p) => p.name !== "Stella" && p.name !== "Pierre"),
            {
                "name":"Stella",
                "unavailable": [
                    {
                        start: new Date('2023-01-07'),
                        end: new Date('2023-01-14'),
                    }
                ]
            } as Person,
            {
                "name":"Pierre",
                "unavailable": [
                    {
                        start: new Date('2023-01-01'),
                        end: new Date('2023-01-17'),
                    }
                ]
            } as Person,
        ];
        const slots = createSlots(roles, new Date('2023-01-01'), new Date('2023-01-31'));
        const orders = createOrders(wTeam, roles);
        const remainingSlots = slots.filter((s) => !assignFullTime(orders, s));

        const pierre = orders.find((o) => o.person.name === "Pierre");
        const stella = orders.find((o) => o.person.name === "Stella");

        expect(remainingSlots.length).toBe(0);
        expect(overlap([...affectations(pierre), ...pierre.person.unavailable])).toBeFalsy();
        expect(overlap([...affectations(stella), ...stella.person.unavailable])).toBeFalsy();
    });
});