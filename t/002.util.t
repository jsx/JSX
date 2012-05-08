#!/usr/bin/env node

var Class = require("../src/Class");
var Test  = require("../src/Test");

eval(Class.$import("../src/util"));

"use strict";

function main() {
    var test = new Test(__filename);

	test.describe('Util.format', function (t) {
		t.expect( Util.format("foo", []) ).toBe("foo");
		t.expect( Util.format("foo %1", ["bar"])).toBe("foo bar");
		t.expect( Util.format("foo %1 %1", ["bar"])).toBe("foo bar bar");
		t.expect( Util.format("foo %2 %1", ["bar", "baz"]) ).
			toBe('foo baz bar');
		t.expect( Util.format("100%%1 %1", ["foo"]) ).toBe("100%1 foo");
	});

	test.describe('Util.repeat', function (t) {
		t.expect( Util.repeat("x", 4) ).toBe("xxxx");
		t.expect( Util.repeat("ab", 4) ).toBe("abababab");
		t.expect( Util.repeat("z", 0) ).toBe("");
	});

	test.describe('Util.encodeStringLiteral', function (t) {
		t.expect(Util.encodeStringLiteral("")).toBe('""');
		t.expect(Util.encodeStringLiteral("abc")).toBe('"abc"');
		t.expect(Util.encodeStringLiteral('"')).toBe('"\\""');
		t.expect(Util.encodeStringLiteral('\0')).toBe('"\\0"');
		t.expect(Util.encodeStringLiteral('\\')).toBe('"\\\\"');
		t.expect(Util.encodeStringLiteral('\u0345')).toBe('"\\u0345"');
	});

	test.describe('Util.decodeStringLiteral', function (t) {
		t.expect(Util.decodeStringLiteral("''")).toBe("");
		t.expect(Util.decodeStringLiteral('""')).toBe("");
		t.expect(Util.decodeStringLiteral("'abc'")).toBe("abc");
		t.expect(Util.decodeStringLiteral("'\\''")).toBe("'");
		t.expect(Util.decodeStringLiteral('"\\""')).toBe('"');
		t.expect(Util.decodeStringLiteral("'\\\\'")).toBe("\\");
		t.expect(Util.decodeStringLiteral("'\\b'")).toBe("\b");
		t.expect(Util.decodeStringLiteral("'\\f'")).toBe("\f");
		t.expect(Util.decodeStringLiteral("'\\n'")).toBe("\n");
		t.expect(Util.decodeStringLiteral("'\\t'")).toBe("\t");
		t.expect(Util.decodeStringLiteral("'\\v'")).toBe("\v");
		t.expect(Util.decodeStringLiteral("'\\u0041'")).toBe("A");
		t.expect(Util.decodeStringLiteral("'\\0'")).toBe("\0");
		t.expect(Util.decodeStringLiteral("'!\\u0041!\\0!\\n!'")).toBe("!A!\0!\n!");
	});

	test.describe('Util.resolvePath', function (t) {
		t.expect(Util.resolvePath("a/b/c")).toBe("a/b/c");
		t.expect(Util.resolvePath("a/./b")).toBe("a/b");
		t.expect(Util.resolvePath("a/../b")).toBe("b");
		t.expect(Util.resolvePath("a/../../b")).toBe("../b");
		t.expect(Util.resolvePath("../../a")).toBe("../../a");
		t.expect(Util.resolvePath("/a/b/c")).toBe("/a/b/c");
		t.expect(Util.resolvePath("/a/../b")).toBe("/b");
		t.expect(Util.resolvePath("/a/../../c")).toBe("/c");
	});

    test.done();
}

main();
// vim: set ft=javascript:
