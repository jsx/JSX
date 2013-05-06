import "../phantomjs.jsx";

import "test-case.jsx";

class PhantomTestCase extends TestCase {
	override function finish() : void {
		super.finish();
		phantom.exit();
	}
}
