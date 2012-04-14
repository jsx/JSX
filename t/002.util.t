#!/usr/bin/env node

var Class = require("../lib/Class");
var Test  = require("../lib/Test");

eval(Class.$import("../lib/util"));

"use strict";

function main() {
    var test = new Test(__filename);

	test.describe('Util.format', function (t) {
		t.expect( Util.format("foo") ).toBe("foo");
		t.expect( Util.format("foo %s", ["bar"]) , '%s').toBe("foo bar");
		t.expect( Util.format("foo %j", ["bar"]) , '%j').toBe('foo "bar"');
		t.expect( Util.format("foo %2:s %1:s", ["bar", "baz"]) ).
			toBe('foo baz bar');
		t.expect( Util.format("100%%s %s", ["foo"]) ).toBe("100%s foo");
	});

	test.describe('Util.repeat', function (t) {
		t.expect( Util.repeat("x", 4) ).toBe("xxxx");
		t.expect( Util.repeat("ab", 4) ).toBe("abababab");
		t.expect( Util.repeat("z", 0) ).toBe("");
	});

	test.describe('Util.calculateSourcePosition', function (t) {
		var lines = [
			"foo\n",
			"\t\tbar\n",
			"baz" ];
		var content = lines.join("");

		var p= Util.calculateSourcePosition(lines, 0);

		t.expect(p.row).toBe(0);
		t.expect(p.col).toBe(0);
		t.expect(p.line).toBe("foo\n");

		p = Util.calculateSourcePosition(lines, content.indexOf("bar"));
		t.expect(p.row).toBe(1);
		t.expect(p.col, 'tab is replaced with 4 spaces').toBe(8);
		t.expect(p.line).toBe("        bar\n");

		p = Util.calculateSourcePosition(lines, content.indexOf("z"));
		t.expect(p.row).toBe(2);
		t.expect(p.col).toBe(2);
		t.expect(p.line, "end withs a new line").toBe("baz\n");

		p = Util.calculateSourcePosition(lines, content.length);
		t.expect(p.row).toBe(3);
		t.expect(p.col).toBe(0);
		t.expect(p.line, "offset exceeded").toBe(null);
	});

    test.done();
}

main();
// vim: set ft=javascript:
