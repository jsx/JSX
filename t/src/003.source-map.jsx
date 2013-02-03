import "js.jsx";
import "js/nodejs.jsx";

import "test-case.jsx";

import "../../src/util.jsx";
import "../../src/jssourcemap.jsx";
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

		this.async((async) -> {
			node.child_process.execFile("bin/jsx", ["--enable-source-map", "--output", "t/src/source-map/hello.jsx.js", "t/src/source-map/hello.jsx"], {} : variant, function (code, stdout, stderr) {
				this.expect(code, "error code").toBe(null);
				//this.expect(stderr, "stderr").toBe("");
				this.expect(stdout, "stdout").toBe("");

				if(code != null) {
					return;
				}

				module.paths.push(cwd + "/node_modules");

				var source = JSLexer.tokenize("hello.jsx.js",
					node.fs.readFileSync("t/src/source-map/hello.jsx.js").toString());

				var mapping = JSON.parse(node.fs.readFileSync("t/src/source-map/hello.jsx.js.mapping").toString());

				this.expect(mapping['file'], "mapping.file").toBe("hello.jsx.js");
				var sources = ["hello.jsx", "timer.jsx", "js.jsx"].sort();
				this.expect((mapping['sources'] as string[]).map.<string>((item) -> { return item.split("/").pop(); }).sort().join(","), "mapping.sources").toBe(sources.join(","));
				var consumer = SourceMapper.createSourceMapConsumer(mapping);

				var pos, orig;

				this.note('search for "Hello, world!"');
				pos = search(source, function (t) { return t.token == '"Hello, world!"'; });
				this.note("generated (literal)" + JSON.stringify(source[pos]));
				orig = consumer.originalPositionFor(source[pos]);
				this.note("original: " + JSON.stringify(orig));
				this.expect(orig['line'], "orig.line").toBe(15);
				this.expect(orig['column'], "orig.column").toBe(21);
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

				async.done();
			});
		}, 5000);
	}

}

// vim: set noexpandtab ft=jsx:
