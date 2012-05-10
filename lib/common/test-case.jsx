import "timer.jsx";

class _Matcher {

	var _test : TestCase;
	var _got  : variant;
	var _name : MayBeUndefined.<string>;

	function constructor(test : TestCase, got : variant) {
		this._test = test;
		this._got  = got;
	}

	function constructor(test : TestCase, got : variant, name : string) {
		this._test = test;
		this._got  = got;
		this._name = name;
	}

	function _match(value : boolean, got : variant, expected : variant, op : string) : void {
		if(value) {
			this._test._ok(this._name);
		}
		else {
			var diag = "comparing with " + op + "\n" +
				"got:      " + got as string + "\n" +
				"expected: " + expected as string + "\n";
			this._test._nok(this._name, diag);
		}
	}

	function toBe(x :  variant) : void {
		this._match(this._got == x,
			this._got, x, "==");
	}
	function notToBe(x :  variant) : void {
		this._match(this._got != x,
			this._got, x, "!=");
	}
	function toBeLT(x :  variant) : void {
		this._match(this._got as number < x as number,
			this._got, x, "<");
	}
	function toBeLE(x :  variant) : void {
		this._match(this._got as number <= x as number,
			this._got, x, "<=");
	}
	function toBeGT(x :  variant) : void {
		this._match(this._got as number > x as number,
			this._got, x, ">");
	}
	function toBeGE(x :  variant) : void {
		this._match(this._got as number >= x as number,
			this._got, x, ">=");
	}
}


class TestCase {
	var _totalCount = 0;
	var _totalPass  = 0;
	var _count = 0;
	var _pass  = 0;
	var _tests : string[];

	// async stuff
	var _currentName : MayBeUndefined.<string>;
	var _tasks = [] : Array.<function():void>; // async tasks

	/* hooks called by src/js/runtests.js */

	function beforeClass(tests : string[]) : void {
		this._tests = tests;
		log "1.." + this._tests.length.toString();
	}

	function run(name : string, testFunction : function():void) : void {
		name = name.replace(/[$].*$/, "");
		// FIXME: catch exception

		var numAsyncTasks = this._tasks.length;
		this._currentName = name;

		testFunction();

		if(numAsyncTasks == this._tasks.length) { // synchronous
			this.after(name);
		}
		else { // asynchronous
		}
	}

	function afterClass() : void {
		if(this._tasks.length == 0) { // synchronous
			this.finish();
		}
		else { // asynchronous
			var next = this._tasks.shift() as function():void;
			next();
		}
	}

	/* implementation */

	function after(name : string) : void {
		++this._totalCount;
		log "\t" + "1.." + this._count.toString();

		if(this._count == this._pass) {
			++this._totalPass;
			log "ok", this._totalCount, "-", name;
		}
		else {
			log "not ok", this._totalCount, "-", name;
		}
		this._count = 0;
		this._pass  = 0;
	}

	function finish() : void {
		if(this._totalCount != this._totalPass) {
			this.diag("tests failed!");
		}
	}

	/* async test stuff */

	function async(testBody : function(:AsyncContext):void, timeoutHandler : function(:AsyncContext):void, timeoutMS : int) : void {

		var async = new AsyncContext(this, this._currentName, timeoutHandler, timeoutMS);

		this._tasks.push(function() : void {
			testBody(async);
		});
	}

	function async(testBody : function(:AsyncContext):void, timeoutMS : int) : void {
		this.async(testBody, function(async : AsyncContext) : void {
			this.fail("TIMEOUT: " + async.name());
			async.done();
		}, timeoutMS);
	}

	/* matcher factory */

	function expect(value : variant) : _Matcher {
		++this._count;
		return new _Matcher(this, value);
	}
	function expect(value : variant, message : string) : _Matcher {
		++this._count;
		return new _Matcher(this, value, message);
	}

	function _ok(name : MayBeUndefined.<string>) : void {
		++this._pass;
		log "\t" + "ok " + (this._count) as string
			+ (name != undefined ? " - " + name :  "");
	}

	function _nok(name : MayBeUndefined.<string>, diag : string) : void {
		log "\t" + "not ok " + (this._count) as string
			+ (name != undefined ? " - " + name :  "");
		this.diag(diag);
	}

	function fail(reason : string) : void {
		log "not ok - fail";
		this.diag(reason);
	}

	function diag(message : string) : void {
		log message.replace(/^/mg, "# ");
	}

	function note(message : string) : void {
		// TODO skip if the process has no tty
		log message.replace(/^/mg, "# ");
	}

	override
	function toString() : string {
		if (this._tests != null) {
			return "TestCase[" + this._tests.join(", ") + "]";
		}
		else { // before boforeClass()
			return "TestCase";
		}
	}
}

class AsyncContext {

	var _test : TestCase;
	var _name : string;
	var _timerId : TimerHandle;

	function constructor(test : TestCase, name : string, timeoutHandler : function(:AsyncContext):void, timeoutMS : int) {
		this._test = test;
		this._name = name;

		var id = Timer.setTimeout(function() : void {
			timeoutHandler(this);
		}, timeoutMS);

		this._timerId = id;
	}

	function name() : string { return this._name; }

	function done() : void {
		Timer.clearTimeout(this._timerId);

		this._test.after(this._name);

		if(this._test._tasks.length != 0) {
			var next = this._test._tasks.shift() as function():void;
			next();
		}
		else {
			this._test.finish();
		}
	}
}
