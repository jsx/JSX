import "test-case.jsx";
import "timer.jsx";

class _Test extends TestCase {

	function testSetTimeout200() : void {
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

	function testSetTimeout100() : void {
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

	function testClearTimeout() : void {
		var id = Timer.setTimeout(function() : void {
			this.fail("setTimeout called after clearTimeout");
		}, 1);
		Timer.clearTimeout(id);

		this.pass("clearTimeout succeeded");
	}

	function testSetInterval() : void {
		this.async(function(async : AsyncContext) : void {
			var interval = 10;
			var count = 3;
			var id : TimerHandle = null;
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

	function testRequestAnimationFrame() : void {
		this.async(function(async : AsyncContext) : void {
			Timer.requestAnimationFrame(function(timeToCall : number) : void {
				this.expect(timeToCall, "requestAnimationFrame").toBeGE(0);

				async.done();
			});
		}, 1000);

	}

	function testCancelAnimationFrame() : void {
		var id = Timer.requestAnimationFrame(function(timeToCall : number) : void {
			this.fail("must be canceled");
		});

		Timer.cancelAnimationFrame(id);

		this.pass("clearAnimationFrame succeeded");
	}
}
