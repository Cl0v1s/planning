"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Person = void 0;
var Person = /** @class */ (function () {
    function Person(_a) {
        var name = _a.name, unavailable = _a.unavailable;
        this.name = name;
        this.unavailable = unavailable.map(function (u) { return ({ start: new Date(u.start), end: new Date(u.end) }); });
    }
    return Person;
}());
exports.Person = Person;
