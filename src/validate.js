"use strict";

var inspect;
try {
    inspect = require("util").inspect; // on node
}
catch(e) {
    inspect = function(x) { return x };
}


function isa(expr, t) {
    if(expr == null) {
        throw new Error("Assertion failed: expected " +
                       t +
                       " but got " + inspect(expr));
    }
    if(typeof(t) === "string") {
        if(!(typeof(expr) === t)) {
            throw new Error("Assertion failed: " +
                            inspect(expr) +
                            " is not a type of " + t);
        }
    }
    else {
        if(!(expr instanceof t)) {
            throw new Error("Assertion failed: " +
                            inspect(expr) +
                            " is not an instance of " + t.name || t);
        }
    }
};

exports.isa = isa;

