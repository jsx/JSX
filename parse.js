#!/usr/bin/env node
"use strict";
var fs     = require('fs');
var util   = require('util');
var parser = require('./jsx.js');

var file = process.argv[2];

var src = fs.readFileSync(file).toString();

try {
    console.log(util.inspect(parser.parse(src), false, 10));
}
catch(e) {
    console.log(e.toString());
    console.log('#line ' + e.line);
    console.log( src.split(/\n/)[ e.line - 1 ] );
    var s = '';
    for(var i = 1; i < e.column; i++) {
        s += ' ';
    }
    console.log(s + '^');
}

