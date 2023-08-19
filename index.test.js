const Jest = require('@jest/globals');

const { datesOverlap, overlap, createSlots } = require('./dist/index.js');

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
    const roles = [
        {
            "name": "Track debug",
            "duration": 14
        },
        {
            "name": "Referrer",
            "duration": 14
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