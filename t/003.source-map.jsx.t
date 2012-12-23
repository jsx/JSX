import "js.jsx";
import "js/nodejs.jsx";

import "test-case.jsx";

import "../src/util.jsx";
import "./util/jslexer.jsx";

native __fake__ class SourceMapConsumer {
	function originalPositionFor(generatedPos : variant) : variant;
}

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

		node.child_process.execFile("bin/jsx", ["--enable-source-map", "--output", "t/source-map/hello.jsx.js", "t/source-map/hello.jsx"], {} : variant, function (code, stdout, stderr) {
			this.expect(code, "error code").toBe(null);
			this.expect(stderr, "stderr").toBe("");
			this.expect(stdout, "stdout").toBe("");

			if(code != null) {
				return;
			}

			module.paths.push(cwd + "/node_modules");

			var eval = js.global['eval'] as (string) -> variant;

			var source = JSLexer.tokenize("hello.jsx.js",
				node.fs.readFileSync("t/source-map/hello.jsx.js").toString());

			var mapping = JSON.parse(node.fs.readFileSync("t/source-map/hello.jsx.js.mapping").toString());

			this.expect(mapping['file'], "mapping.file").toBe("t/source-map/hello.jsx.js");
			var sources = ["t/source-map/hello.jsx", "lib/js/timer.jsx", "lib/js/js.jsx"].sort();
			this.expect(JSON.stringify((mapping['sources'] as string[]).sort()), "mapping.sources").toBe(JSON.stringify(sources));
			var consumer = eval('new (require("source-map").SourceMapConsumer)(mapping)') as __noconvert__ SourceMapConsumer;

			var pos, orig;

			pos = search(source, function (t) { return t.token == '"Hello, world!"'; });
			this.note("generated (literal)" + JSON.stringify(source[pos]));
			orig = consumer.originalPositionFor(source[pos]);
			this.note("original: " + JSON.stringify(orig));
			this.expect(orig['line'], "orig.line").toBe(14);
			this.expect(orig['column'], "orig.column").toBe(12);
			this.expect(orig['name'], "orig.name").toBe(null);

			pos = search(source, function (t) { return t.token == '_Main'; });
			this.note("generated (class): " + JSON.stringify(source[pos]));
			orig = consumer.originalPositionFor(source[pos]);
			this.note("original: " + JSON.stringify(orig));
			this.expect(orig['line'], "orig.line").toBe(5);
			this.expect(orig['column'], "orig.column").toBe(6);
			this.expect(orig['name'], "orig.name").toBe("_Main");

			pos = search(source, function (t) { return t.token == 'getFoo$'; });
			this.note("generated (member function): " + JSON.stringify(source[pos]));
			orig = consumer.originalPositionFor(source[pos]);
			this.note("original: " + JSON.stringify(orig));
			this.expect(orig['line'], "orig.line").toBe(9);
			this.expect(orig['column'], "orig.column").toBe(13);
			this.expect(orig['name'], "orig.name").toBe("getFoo");
		});
	}

}

// vim: set noexpandtab ft=jsx:
