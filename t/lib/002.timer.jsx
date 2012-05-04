import "test-case.jsx";
import "timer.jsx";

class _Test extends TestCase {

	function test_setTimeout200() : void {
		var to = 200;
		var t0 = Date.now();
		Timer.setTimeout(function() : void {
			var t1 = Date.now();

			this.expect(t1 - t0, "setTimeout").toBeGE(to - 50);

			this.done();
		}, to);
	}

	function test_setTimeout100() :void {
		var to = 100;
		var t0 = Date.now();
		Timer.setTimeout(function() : void {
			var t1 = Date.now();

			this.expect(t1 - t0, "setTimeout").toBeGE(to - 50);

			this.done();
		}, to);
	}

	function test_clearTimeout() :void {
		var id  = Timer.setTimeout(function() : void {
			this.fail("setTimeout called after clearTimeout");
		}, 1);
		Timer.clearTimeout(id);

		this.expect(true , "clearTimeout").toBeGE(true);

		this.done();
	}

	function test_setInterval() :void {
		var interval = 10;
		var count = 3;
		var id : TimerHandle;
		id = Timer.setInterval(function() : void {
			--count;
			this.expect(count, "setInterval " + count as string).toBeGE(0);

			if(count == 0) {
				Timer.clearInterval(id);
				this.done();
			}

		}, interval);
	}
}
