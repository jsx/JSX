import "test-case.jsx";
import "timer.jsx";

class _Test extends TestCase {

	function test_setTimeout200() : void {
		this.async(function(async : AsyncContext) : void {
			var to = 200;
			var t0 = Date.now();
			Timer.setTimeout(function() : void {
				var t1 = Date.now();

				this.expect(t1 - t0, "setTimeout 200 ms.").toBeGE(to - 50);

				async.done();
			}, to);
		}, 1000);
	}

	function test_setTimeout100() : void {
		this.async(function(async : AsyncContext) : void {
			var to = 100;
			var t0 = Date.now();
			Timer.setTimeout(function() : void {
				var t1 = Date.now();

				this.expect(t1 - t0, "setTimeout 100 ms.").toBeGE(to - 50);

				async.done();
			}, to);
		}, 1000);
	}

	function test_clearTimeout() : void {
		var id = Timer.setTimeout(function() : void {
			this.fail("setTimeout called after clearTimeout");
		}, 1);
		Timer.clearTimeout(id);

		this.expect(id, "clearTimeout").toBe(id);
	}

	function test_setInterval() : void {
		this.async(function(async : AsyncContext) : void {
			var interval = 10;
			var count = 3;
			var id : MayBeUndefined.<TimerHandle> = undefined;
			id = Timer.setInterval(function() : void {
				--count;
				this.expect(count, "setInterval " + count as string).toBeGE(0);

				if(count == 0) {
					Timer.clearInterval(id);
					async.done();
				}

			}, interval);
		}, 1000);
	}
}
