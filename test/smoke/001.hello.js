#!/usr/bin/env node
"use strict";
// FIXME
var project_path = __dirname + "/../..";
module.paths.unshift(project_path + "/lib");

var Test = require("Test");

var Compiler = require("Compiler");

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

    var f = new Function(source);
    t.expect(f).toBeInstanceOf(Function);

    t.done();
});

test.done();
