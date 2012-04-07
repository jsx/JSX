"use strict;"
/*
# NAME

dump - Dump data structures

# SYNOPSIS

var dump = require('path/to/dump');

dump.p(data);               # outputs to console
foo.innerHTML = dump(data); # as string

*/

var dump;
try {
    dump = function() {
        var u = require('util');

        return function(data) {
            return u.inspect(data, false, 255);
        };
    }();
}
catch(e) {
    dump = function(data) {
        return JSON.stringify(data, null, 2);
    };
}

module.exports = dump;
dump.p = function(__va_args__) {
    Array.prototype.map.call(arguments, dump);
};

