"use strict";
exports.__esModule = true;
function simplifyObject(object) {
    var simpleObject = {};
    for (var property in object) {
        if (!object.hasOwnProperty(property)) {
            continue;
        }
        if (typeof (object[property]) == 'object') {
            continue;
        }
        if (typeof (object[property]) == 'function') {
            continue;
        }
        simpleObject[property] = object[property];
    }
    return JSON.stringify(simpleObject);
}
exports["default"] = simplifyObject;
;
