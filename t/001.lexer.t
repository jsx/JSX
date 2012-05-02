#!/usr/bin/env node

var Class = require("../src/Class");
var Test  = require("../src/Test");

eval(Class.$import("../src/parser"));

var TT = _TokenTable;

"use strict";

function lexerTest(t, rx, good, bad) {
    t.note("matched");
    var i;
    var matched;
    for(i = 0; i < good.length; ++i) {
        matched = good[i].match(rx);
        t.expect(matched, JSON.stringify(good[i])).toBeInstanceOf(Object);
        if(matched) {
            t.expect(matched[0]).toBe(good[i]);
        }
    }

    t.note("not matched");
    for(i = 0; i < bad.length; ++i) {
        matched = bad[i].match(rx);
        t.expect(matched, JSON.stringify(bad[i])).toBe(null);
    }
}

function main() {
    var test = new Test(__filename);

    // Testing the following patterns:
    var rxIdent          = TT.rxIdent;
    var rxIntegerLiteral = TT.rxIntegerLiteral;
    var rxNumberLiteral  = TT.rxNumberLiteral;
    var rxStringLiteral  = TT.rxStringLiteral;
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
            "NaN",
            "Infinity",
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
            "nan",
            "infinity",
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


    test.describe("tokenize strings", function(t) {
        var good = [
            '"foo"',
            '"foo bar"',
            '"foo\\"bar"',
            '"foo\\n"',
            '""',
            "'foo'",
            "'foo bar'",
            "'foo\\'bar'",
            "'foo\\n'",
            "''"
        ];

        var bad = [
            '"',
            "'",
            ''
        ];

        lexerTest(t, rxStringLiteral, good, bad);
        t.done();
    });

    test.describe("tokenize regular expressions", function(t) {
        var good = [
            '/foo/',
            '/foo\\/bar/',
            '/[a-zA-Z]/',
            '/foo/i',
            '/foo/m',
            '/foo/g',
            '/foo/img',
            '/foo/igm',
            '/foo/mgi',
            '/foo/mgi',
            '/foo/gim',
            '/foo/gmi',
            '/./'
        ];

        var bad = [
            "/",
            " "
        ];

        lexerTest(t, rxRegExpLiteral, good, bad);
        t.done();
    });


    test.done();
}

main();
// vim: set ft=javascript:
