#!/usr/bin/env node

var SourceMapConsumer = require("source-map").SourceMapConsumer;
var execFile = require("child_process").execFile;
var fs = require("fs");

var JSLexer = require("./util/jslexer");

var Class = require("../src/Class");
var Test  = require("../src/Test");

eval(Class.$import("../src/util"));

"use strict";

function search(a, predicate) {
	for(var i = 0; i < a.length; ++i) {
		if(predicate(a[i])) {
			return i;
		}
	}
	return -1;
}

function main() {
	var test = new Test(__filename);

	test.describe('with SourceMapConsumer', function (t) {

		if(process.env["JSX_DISABLE_SOURCE_MAP_TEST"]) {
			t.done();
			test.done();
			return;
		}

		execFile("bin/jsx", ["--enable-source-map", "--output", "t/source-map/hello.compiled.js", "t/source-map/hello.jsx"], {}, function (code, stdout, stderr) {
			t.expect(code, "error code").toBe(null);
			t.expect(stderr, "stderr").toBe("");
			t.expect(stderr, "stdout").toBe("");

			var source = JSLexer.tokenize("hello.compiled.js",
				fs.readFileSync("t/source-map/hello.compiled.js").toString());

			var mapping = JSON.parse(fs.readFileSync("t/source-map/hello.compiled.js.mapping").toString());

			t.expect(mapping.file, "mapping.file").toBe("t/source-map/hello.compiled.js");

			var consumer = new SourceMapConsumer(mapping);

			var pos, orig;

			pos = search(source, function (t) { return t.token === '"Hello, world!"' });
			t.note("for literal " + JSON.stringify(source[pos]));
			orig = consumer.originalPositionFor(source[pos]);
			t.note(JSON.stringify([source[pos], orig]));
			t.expect(orig.line, "orig.line").toBe(11);
			t.expect(orig.column, "orig.column").toBe(12);
			t.expect(orig.name, "orig.name").toBe(null);

			pos = search(source, function (t) { return t.token === '_Main' });
			t.note("for class " + JSON.stringify(source[pos]));
			orig = consumer.originalPositionFor(source[pos]);
			t.note(JSON.stringify([source[pos], orig]));
			t.expect(orig.line, "orig.line").toBe(2);
			t.expect(orig.column, "orig.column").toBe(6);
			t.expect(orig.name, "orig.name").toBe("_Main");

			pos = search(source, function (t) { return t.token === 'getFoo$' });
			t.note("for member function " + JSON.stringify(source[pos]));
			orig = consumer.originalPositionFor(source[pos]);
			t.note(JSON.stringify([source[pos], orig]));
			t.expect(orig.line, "orig.line").toBe(6);
			t.expect(orig.column, "orig.column").toBe(13);
			t.expect(orig.name, "orig.name").toBe("getFoo");

			pos = search(source, function (t) { return t.token === 'foo' });
			t.note("for member variable " + JSON.stringify(source[pos]));
			orig = consumer.originalPositionFor(source[pos]);
			t.note(JSON.stringify([source[pos], orig]));
			t.expect(orig.line, "orig.line").toBe(3);
			t.expect(orig.column, "orig.column").toBe(8);
			t.expect(orig.name, "orig.name").toBe("foo");

			pos = search(source, function (t) { return t.token === 'bar' });
			t.note("for static member variable " + JSON.stringify(source[pos]));
			orig = consumer.originalPositionFor(source[pos]);
			t.note(JSON.stringify([source[pos], orig]));
			t.expect(orig.line, "orig.line").toBe(4);
			t.expect(orig.column, "orig.column").toBe(15);
			t.expect(orig.name, "orig.name").toBe("bar");

			pos = search(source, function (t) { return t.token === 'args' });
			t.note("for parameters " + JSON.stringify(source[pos]));
			orig = consumer.originalPositionFor(source[pos]);
			t.note(JSON.stringify([source[pos], orig]));
			t.expect(orig.line, "orig.line").toBe(14);
			t.expect(orig.column, "orig.column").toBe(25);
			t.expect(orig.name, "orig.name").toBe("args");

			var tokens = source.filter(function (t) {
				return t.token === "run$";
			});
			t.note("for static function " + JSON.stringify(tokens));
			orig = consumer.originalPositionFor(tokens[0]);
			if(orig) {
				t.note(JSON.stringify([tokens[0], orig]));
				t.expect(orig.line, "orig.line").toBe(10);
				t.expect(orig.column, "orig.column").toBe(20);
				t.expect(orig.name, "orig.name").toBe("run");
			}
			else {
				t.fail("position not found");
			}


			t.done();
			test.done();
		});
	});

}

main();
// vim: set noexpandtab:
