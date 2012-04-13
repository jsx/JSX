#!/usr/bin/env node

var Class = require("../lib/Class");
var Test  = require("../lib/Test");

eval(Class.$import("../lib/parser"));

var TT = _TokenTable;

"use strict";

function lexerTest(t, rx, good, bad) {
    t.note("matched");
    var i;
    for(i = 0; i < good.length; ++i) {
        t.expect(rx.test(good[i]), JSON.stringify(good[i])).toBe(true);
    }

    t.note("not matched");
    for(i = 0; i < bad.length; ++i) {
        t.expect(rx.test(bad[i]), JSON.stringify(bad[i])).toBe(false);
    }
}

function main() {
    var test = new Test(__filename);

    // Testing the following patterns:
    var rxIdent          = TT.rxIdent;
    var rxIntegerLiteral = TT.rxIntegerLiteral;
    var rxNumberLiteral  = TT.rxNumberLiteral;
    var rxRegExpLiteral  = TT.rxRegExpLiteral;
    var rxSpace          = TT.rxSpace;

    test.describe('tokenize identifiers', function(t) {
        var good = [
            "foo",
            "bar",
            "abcdefghijklmnopqrstuvwxyz",
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "f",
            "_foo",
            "_",
            "foo_",
            "foo123",
            "foo_123",
            "varfoo",
            "var_foo",
            "var123"
        ];
        var bad = [
            "123",
            "$foo",
            " ",
            ".",
            "/",
            "+",
            "-",
            "-foo",
            " ",
            "\n"
        ];

        lexerTest(t, rxIdent, good, bad);

        t.done();
    });

    test.describe('tokenize numbers', function(t) {
        var good = [
            "123456789.0",
            "3.14",
            ".012",
            "0.012",
            "0.012e8",
            "0.e8",
            "0.e+8",
            "0.e-8",
            "1e32",
            "1E32",
            "0E0",
            "0.0"
        ];
        var bad = [
            "1a2",
            "1x2",
            "foo",
            "..2",
            "2..",
            "x2",
            "!42",
            "+",
            " "
        ];

        lexerTest(t, rxNumberLiteral, good, bad);

        t.done();
    });
    test.describe('tokenize integers', function(t) {
        var good = [
            "1",
            "42",
            "1234567890",
            "0xabcdef123",
            "0XABCDEF123",

            "0"
            // TODO: list ECMA 262 compatible
        ];
        var bad = [
            "3.14",
            ".012",
            "0.012",
            "0.012e8",
            "0.e8",
            "1e32",
            "1E32",
            "0E0",
            "0xGG",
            "0xZZ",
            "088",
            "0b1212",

            "+"
        ];

        lexerTest(t, rxIntegerLiteral, good, bad);
        t.done();
    });

    test.done();
}

main();
// vim: set ft=javascript:
