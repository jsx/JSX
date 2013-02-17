import "js.jsx";

import "test-case.jsx";

import "../../src/jsx-command.jsx";
import "../../src/jsx-node-front.jsx";

class _Test extends TestCase {

	function testJSXDoc() : void {
		var platform = new NodePlatform(".");
		var statusCode = JSXCommand.main(platform, ["--mode", "doc", "--output", "t/src/jsxdoc/", "t/src/jsxdoc/hello.jsx"]);

		this.expect(statusCode, "status code").toBe(0);

		if(statusCode != 0) {
			return;
		}

		var file = "t/src/jsxdoc/t/src/jsxdoc/hello.jsx.html";
		this.expect(platform.fileExists(file), "HTML file has been generated").toBe(true);

		var content = platform.load(file);
		this.expect(content).toMatch(/Module Description/);

		this.expect(content).toMatch(/Class Description/);
		this.expect(content).toMatch(/MyClass/);

		this.expect(content).toMatch(/Instance Variable/);
		this.expect(content).toMatch(/instanceVariable/);

		this.expect(content).toMatch(/Class Variable/);
		this.expect(content).toMatch(/classVariable/);

		this.expect(content).toMatch(/Constructor/);

		this.expect(content).toMatch(/Static Method/);
		this.expect(content).toMatch(/List of Strings/);
		this.expect(content).toMatch(/staticMethod/);

		this.expect(content).toMatch(/Instance Method/);
		this.expect(content).toMatch(/List of Numbers/);
		this.expect(content).toMatch(/instanceMethod/);
	}

}

// vim: set noexpandtab:
