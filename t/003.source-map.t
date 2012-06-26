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

		execFile("bin/jsx", ["--enable-source-map", "--output", "t/source-map/hello.jsx.js", "t/source-map/hello.jsx"], {}, function (code, stdout, stderr) {
			t.expect(code, "error code").toBe(null);
			t.expect(stderr, "stderr").toBe("");
			t.expect(stdout, "stdout").toBe("");

			if(code != null) {
				t.done();
				test.done();
				return;
			}

			var source = JSLexer.tokenize("hello.jsx.js",
				fs.readFileSync("t/source-map/hello.jsx.js").toString());

			var mapping = JSON.parse(fs.readFileSync("t/source-map/hello.jsx.js.mapping").toString());

			t.expect(mapping.file, "mapping.file").toBe("t/source-map/hello.jsx.js");
			var sources = ["t/source-map/hello.jsx", "lib/js/timer.jsx", "lib/js/js.jsx"].sort();
			t.expect(JSON.stringify(mapping.sources.sort()), "mapping.sources").toBe(JSON.stringify(sources));

			var consumer = new SourceMapConsumer(mapping);

			var pos, orig;

			pos = search(source, function (t) { return t.token === '"Hello, world!"' });
			t.note("generated (literal)" + JSON.stringify(source[pos]));
			orig = consumer.originalPositionFor(source[pos]);
			t.note("original: " + JSON.stringify(orig));
			t.expect(orig.line, "orig.line").toBe(14);
			t.expect(orig.column, "orig.column").toBe(12);
			t.expect(orig.name, "orig.name").toBe(null);

			pos = search(source, function (t) { return t.token === '_Main' });
			t.note("generated (class): " + JSON.stringify(source[pos]));
			orig = consumer.originalPositionFor(source[pos]);
			t.note("original: " + JSON.stringify(orig));
			t.expect(orig.line, "orig.line").toBe(5);
			t.expect(orig.column, "orig.column").toBe(6);
			t.expect(orig.name, "orig.name").toBe("_Main");

			pos = search(source, function (t) { return t.token === 'getFoo$' });
			t.note("generated (member function): " + JSON.stringify(source[pos]));
			orig = consumer.originalPositionFor(source[pos]);
			t.note("original: " + JSON.stringify(orig));
			t.expect(orig.line, "orig.line").toBe(9);
			t.expect(orig.column, "orig.column").toBe(13);
			t.expect(orig.name, "orig.name").toBe("getFoo");

			t.done();
			test.done();
		});
	});

}

main();
// vim: set filetype=javascript:
// vim: set noexpandtab:
