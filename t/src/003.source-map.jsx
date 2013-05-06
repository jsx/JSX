import "nodejs/node.jsx";

import "test-case.jsx";

import "../../src/util.jsx";
import "../../src/jssourcemap.jsx";
import "../../src/jsx-command.jsx";
import "../../src/jsx-node-front.jsx";

import "../util/jslexer.jsx";

class _Test extends TestCase {

	function testWithSourceMapConsumer() : void {
		if(process.env["JSX_DISABLE_SOURCE_MAP_TEST"]) {
			this.diag("skip source-map testing because: JSX_DISABLE_SOURCE_MAP_TEST is true");
			return;
		}
		if ((process.env["JSX_OPTS"] ?: "").match(/\bminify\b/)) {
			this.diag("skip source-map testing because: JSX_OPTS includes --minify");
			return;
		}

		function search(a : JSToken[], predicate : (JSToken) -> boolean) : number {
			for(var i = 0; i < a.length; ++i) {
				if(predicate(a[i])) {
					return i;
				}
			}
			return -1;
		}

		var platform = new NodePlatform(".");

		var jsxSourceFile = "t/src/source-map/hello.jsx";

		var args = ["--enable-source-map", "--output", jsxSourceFile+".js", jsxSourceFile];
		var statusCode = JSXCommand.main(platform, NodePlatform.getEnvOpts().concat(args));

		this.expect(statusCode, "status code").toBe(0);

		var source = JSLexer.tokenize("hello.jsx.js", platform.load(jsxSourceFile + ".js"));

		var mapping = JSON.parse(platform.load(jsxSourceFile+".js.mapping"));

		// mapping.file
		this.expect(mapping['file'], "mapping.file").toBe("hello.jsx.js");

		this.note("mapping.sources: " + JSON.stringify(mapping['sources']));
		this.note("mapping.names:   " + JSON.stringify(mapping['names']));

		// mappping.sources
		["hello.jsx", "timer.jsx"].forEach((file) -> {
			var sources = mapping['sources'] as string[];

			var found = sources.filter((x) -> { return x.slice(x.length - file.length) == file; });
			this.expect(found.join(","), "mapping.sources includes " + file).notToBe("");
		});

		// source-map consumer
		var consumer = new SourceMapConsumer(mapping);

		var pos, orig;

		this.note('search for "Hello, world!"');
		pos = search(source, function (t) { return t.token == '"Hello, world!"'; });
		this.note("generated (string literal)" + JSON.stringify(source[pos]));
		orig = consumer.originalPositionFor(source[pos]);
		this.note("original: " + JSON.stringify(orig));
		this.expect(orig['line'], "orig.line").toBe(15);
		this.expect(orig['column'], "orig.column").toBe(20);
		this.expect(orig['name'], "orig.name").toBe(null);
		this.expect(platform.fileExists("t/src/source-map/" + orig['source'] as string), orig['source'] as string + " exists").toBe(true);

		this.note('search for 42');
		pos = search(source, function (t) { return t.token == '42'; });
		this.note("generated (number literal)" + JSON.stringify(source[pos]));
		orig = consumer.originalPositionFor(source[pos]);
		this.note("original: " + JSON.stringify(orig));
		this.expect(orig['line'], "orig.line").toBe(7);
		this.expect(orig['column'], "orig.column").toBe(14);
		this.expect(orig['name'], "orig.name").toBe(null);
		this.expect(platform.fileExists("t/src/source-map/" + orig['source'] as string), orig['source'] as string + " exists").toBe(true);

		this.note('search for _Main');
		pos = search(source, function (t) { return /^_Main\b/.test(t.token); });
		this.note("generated (class): " + JSON.stringify(source[pos]));
		orig = consumer.originalPositionFor(source[pos]);
		this.note("original: " + JSON.stringify(orig));
		this.expect(orig['line'], "orig.line").toBe(6);
		this.expect(orig['column'], "orig.column").toBe(6);
		this.expect(orig['name'], "orig.name").toBe("_Main");
		this.expect(platform.fileExists("t/src/source-map/" + orig['source'] as string), orig['source'] as string + " exists").toBe(true);

		this.note('search for "getFoo"');
		pos = search(source, function (t) { return /\bgetFoo\b/.test(t.token); });
		this.note("generated (member function): " + JSON.stringify(source[pos]));
		orig = consumer.originalPositionFor(source[pos]);
		this.note("original: " + JSON.stringify(orig));
		this.expect(orig['line'], "orig.line").toBe(10);
		this.expect(orig['column'], "orig.column").toBe(13);
		this.expect(orig['name'], "orig.name").toBe("getFoo");
		this.expect(platform.fileExists("t/src/source-map/" + orig['source'] as string), orig['source'] as string + " exists").toBe(true);
	}

}

// vim: set noexpandtab:
