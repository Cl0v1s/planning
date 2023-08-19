"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assign = exports.overlap = exports.datesOverlap = exports.createSlots = void 0;
var config_json_1 = require("./config.json");
var Person_1 = require("./types/Person");
function createSlots(roles, start, end) {
    var slots = roles.map(function (r) {
        var s = new Date(start);
        var results = [];
        do {
            var t = new Date(s);
            // If role starts on Monday it lasts Monday - Sunday (7 days - 1 day)
            t.setDate(t.getDate() + r.duration - 1);
            var result = {
                role: r,
                start: s,
                end: new Date(t)
            };
            // next person takes it on monday
            t.setDate(t.getDate() + 1);
            s = new Date(t);
            results = __spreadArray(__spreadArray([], results, true), [result], false);
        } while (s < end);
        return results;
    }).flat();
    return slots;
}
exports.createSlots = createSlots;
/**
 * Detects if two date spans overlaps
 * @param d1
 * @param d2
 * @returns
 */
function datesOverlap(d1, d2) {
    var r = new Date(d1.start) <= new Date(d2.end) && new Date(d1.end) >= new Date(d2.start);
    return r;
}
exports.datesOverlap = datesOverlap;
/**
 * Detects if there is any overlap in a list of spans
 * @param spans
 * @returns
 */
function overlap(spans) {
    return !!spans.find(function (s1) { return spans.find(function (s2) { return s1 !== s2 && datesOverlap(s1, s2); }); });
}
exports.overlap = overlap;
function assign(orders, slot) {
    // console.log('coucou');
    // console.log(JSON.stringify(orders, null, 2));
    // console.log(JSON.stringify(slot, null, 2));
    // const ordered = [...orders.sort((a, b) => {
    //     const affectationsA = a.affectations.find((af) => af.role === slot.role) as {role: Role, spans: Array<DateSpan>};
    //     const affectationsB = b.affectations.find((af) => af.role === slot.role) as {role: Role, spans: Array<DateSpan>};
    //     return affectationsA.spans.length - affectationsB.spans.length;
    // })];
    // const originalOrdered: Array<Order> = JSON.parse(JSON.stringify(ordered));
    // let first: Order | undefined;
    // do {
    //     first = ordered.shift();
    // } while (first && overlap([...first.person.unavailable, ...first.affectations.map((af) => af.spans).flat(), slot]));
    // // arbitrary affectation even if turns arent respected
    // if(first == null) {
    //     // we found nobody in the available tours, we will add someone that fits in the list
    //     first = originalOrdered.find((order) => !overlap([...order.person.unavailable, ...order.affectations.map((af) => af.spans).flat(), slot]));
    // }
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
exports.assign = assign;
function createRound(start, end, team, roles) {
    // we init an array associate persons with number of times they were affected
    var order = team.map(function (p) { return (__assign({ person: p }, roles.reduce(function (acc, role) {
        var _a;
        return __assign(__assign({}, acc), (_a = {}, _a[role.name] = [], _a));
    }, {}))); });
    var slots = createSlots(roles, start, end);
    // slots.forEach((s) => { if(!assign(order, s)) console.log('Unable to assign ' + s.start + " to " + s.end + "(" + s.role.name + ")") });
    // roles.forEach((role) => {
    //     const affectations = order.map((o) => {
    //         return o.affectations.find((a) => a.role.name === role.name).spans.map((s) => ({ ...s, name: o.person.name }))
    //     }).flat().sort((a, b) => a.start.getTime() - b.start.getTime());
    //     console.log(`Roles: ${role.name}`);
    //     console.log(affectations);
    // })
}
createRound(new Date(config_json_1.start), new Date(config_json_1.end), config_json_1.team.map(function (p) { return new Person_1.Person(p); }), __spreadArray([], config_json_1.roles, true));
