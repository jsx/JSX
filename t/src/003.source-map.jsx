import "js/nodejs.jsx";

import "test-case.jsx";

import "../../src/util.jsx";
import "../../src/jssourcemap.jsx";
import "../../src/jsx-command.jsx";
import "../../src/jsx-node-front.jsx";

import "../util/jslexer.jsx";

class _Test extends TestCase {

	function testWithSourceMapConsumer() : void {
		function search(a : JSToken[], predicate : (JSToken) -> boolean) : number {
			for(var i = 0; i < a.length; ++i) {
				if(predicate(a[i])) {
					return i;
				}
			}
			return -1;
		}

		if(process.env["JSX_DISABLE_SOURCE_MAP_TEST"]) {
			return;
		}

		var cwd = process.cwd();
		module.paths.push(cwd + "/node_modules");

		var platform = new NodePlatform(".");

		var statusCode = JSXCommand.main(platform, NodePlatform.getEnvOpts().concat(["--enable-source-map", "--output", "t/src/source-map/hello.jsx.js", "t/src/source-map/hello.jsx"]));

		this.expect(statusCode, "status code").toBe(0);

		if(statusCode != 0) {
			return;
		}

		var source = JSLexer.tokenize("hello.jsx.js",
				platform.load("t/src/source-map/hello.jsx.js"));

		var mapping = JSON.parse(platform.load("t/src/source-map/hello.jsx.js.mapping"));

		// mapping.file
		this.expect(mapping['file'], "mapping.file").toBe("hello.jsx.js");

		this.note("mapping.sources: " + JSON.stringify(mapping['sources']));
		this.note("mapping.names:   " + JSON.stringify(mapping['names']));

		// mappping.sources
		["hello.jsx", "timer.jsx", "js.jsx"].forEach((file) -> {
			var sources = mapping['sources'] as string[];

			var found = sources.filter((x) -> { return x.slice(x.length - file.length) == file; });
			this.expect(found.join(","), "mapping.sources includes " + file).notToBe("");
		});

		// source-map consumer
		var consumer = SourceMapper.createSourceMapConsumer(mapping);

		var pos, orig;

		this.note('search for "Hello, world!"');
		pos = search(source, function (t) { return t.token == '"Hello, world!"'; });
		this.note("generated (string literal)" + JSON.stringify(source[pos]));
		orig = consumer.originalPositionFor(source[pos]);
		this.note("original: " + JSON.stringify(orig));
		this.expect(orig['line'], "orig.line").toBe(15);
		this.expect(orig['column'], "orig.column").toBe(21);
		this.expect(orig['name'], "orig.name").toBe(null);

		this.note('search for 42');
		pos = search(source, function (t) { return t.token == '42'; });
		this.note("generated (number literal)" + JSON.stringify(source[pos]));
		orig = consumer.originalPositionFor(source[pos]);
		this.note("original: " + JSON.stringify(orig));
		this.expect(orig['line'], "orig.line").toBe(7);
		this.expect(orig['column'], "orig.column").toBe(15);
		this.expect(orig['name'], "orig.name").toBe(null);

		this.note('search for _Main');
		pos = search(source, function (t) { return /^_Main\b/.test(t.token); });
		this.note("generated (class): " + JSON.stringify(source[pos]));
		orig = consumer.originalPositionFor(source[pos]);
		this.note("original: " + JSON.stringify(orig));
		this.expect(orig['line'], "orig.line").toBe(6);
		this.expect(orig['column'], "orig.column").toBe(7);
		this.expect(orig['name'], "orig.name").toBe("_Main");

		this.note('search for getFoo$');
		pos = search(source, function (t) { return /^getFoo\b/.test(t.token); });
		this.note("generated (member function): " + JSON.stringify(source[pos]));
		orig = consumer.originalPositionFor(source[pos]);
		this.note("original: " + JSON.stringify(orig));
		this.expect(orig['line'], "orig.line").toBe(10);
		this.expect(orig['column'], "orig.column").toBe(14);
		this.expect(orig['name'], "orig.name").toBe("getFoo");

	}

}

// vim: set noexpandtab ft=jsx:
