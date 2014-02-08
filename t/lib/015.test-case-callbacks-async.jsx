import "test-case.jsx";
import "timer.jsx";

class _Test extends TestCase {
	var stash = new Map.<string>; // emulating global resources like files

	override function setUp(async : AsyncContext) : void {
		this.stash[async.name()] = async.name();
	}
	override function tearDown(async : AsyncContext) : void {
		this.expect(this.stash[async.name()], 'tearDown(async)').notToBe(null);
		delete this.stash[async.name()];
	}

	function testAsync1() : void {
		this.async((async) -> {
			Timer.setTimeout(() -> {
				this.expect(this.stash.keys().length).toBe(1);
				this.expect(this.stash[async.name()]).toBe("testAsync1");
				async.done();
			}, 1);
		}, 1000);
	}

	function testAsync2() : void {
		this.async((async) -> {
			Timer.setTimeout(() -> {
				this.expect(this.stash.keys().length).toBe(1);
				this.expect(this.stash[async.name()]).toBe("testAsync2");
				async.done();
			}, 1);
		}, 1000);
	}
}
