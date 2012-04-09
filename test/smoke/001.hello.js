#!/usr/bin/env node
"use strict";

var Test = require("Test");

var Compiler = require("Compiler");

var project_path = __dirname + "/../..";

var test = new Test(__filename);

test.describe('new Compiler', function(t) {
	var compiler = new Compiler();

	t.expect(compiler).toBeInstanceOf(Compiler);

	t.done(compiler);
}).next('compile', function(t, compiler) {
	compiler.addSourceFile(project_path +
						   "/example/hello.jsx");

	t.expect(compiler.compile()).toBe(true);

	var source = compiler.getOutput();
	t.expect(source, 'output').toBeTruthy();

	t.done(source);
}).next('eval', function(t, source) {
	var helloMaker = new Function(source + "; return Hello");
	t.expect(helloMaker, 'new Function').toBeInstanceOf(Function);

	var hello = helloMaker();

	t.expect(hello, 'Hello').toBeInstanceOf(Function);

	var save = console.log;
	var capture = "";
	var ret;
	console.log = function(s) { capture += s + "\n"; };

	try {
		ret = hello.main1AS([]);
	}
	finally {
		console.log = save;
	}

	t.expect(ret, 'retval').toBe(0);
	t.expect(capture, 'output').toBe("Hello, world!\n");
});

test.done();
