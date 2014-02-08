import "test-case.jsx";

class _Test extends TestCase {
	var stack = new Array.<number>; // emulating global resources like files

	override function setUp() : void {
		this.stack.push(42);
	}
	override function tearDown() : void {
		this.stack.pop();
	}

	function top() : number {
		return this.stack[this.stack.length - 1];
	}

	function testSync1() : void {
		this.expect(this.stack.length).toBe(1);
		this.expect(this.top()).toBe(42);
	}
	function testSync2() : void {
		this.expect(this.stack.length).toBe(1);
		this.expect(this.top()).toBe(42);
	}
}
