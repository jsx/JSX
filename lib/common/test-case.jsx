/*
 * Copyright (c) 2012,2013 DeNA Co., Ltd. et al.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

/***
 * <p>Unit Test Framework for JSX</p>
 *
<h2>SYNOPSIS</h2>
<pre><code class="language-jsx">
import "test-case.jsx";
import "timer.jsx";

class _Test extends TestCase {

	// synchrounous tests which run in serial

	function testClearTimeout() : void {
		var id = Timer.setTimeout(() -> {
			this.fail("setTimeout called after clearTimeout");
		}, 1);
		Timer.clearTimeout(id);

		this.expect(id, "clearTimeout").toBe(id);
	}

	// asynchronous tests which start in parallel but run in serial

	function testSetTimeout() : void {
		this.async((async) -> {
			var to = 200;
			var t0 = Date.now();
			Timer.setTimeout(() -> {
				var t1 = Date.now();

				this.expect(t1 - t0, "setTimeout 200 ms.").toBeGE(to - 50);

				async.done();
			}, to);
		}, 1000);
	}
}</code></pre>

 * @author DeNA., Co., Ltd. et. al.
 * @version 1.1.0
 */

import "timer.jsx";
import "console.jsx";

/**
 * Base class for test cases
 */
class TestCase {
	// TODO turn off when the process has no tty
	var verbose = true;
	var showStackTrace = true; // turn off on test this class

	var _totalCount = 0;
	var _totalPass  = 0;
	var _count = 0;
	var _pass  = 0;
	var _tests : string[];

	// async stuff
	var _currentName : Nullable.<string>;
	var _tasks = [] : Array.<function():void>; // async tasks

	/**
	 * Set up for each test method.
	 */
	function setUp() : void { }

	/**
	 * Tear down for each test method.
	 */
	function tearDown() : void { }

	/**
	 * Set up for each asynchronous test method.
	 */
	function setUp(async : AsyncContext) : void { }

	/**
	 * Tear down for each asynchronous test method.
	 */
	function tearDown(async : AsyncContext) : void { }

	/* low-level hooks called by src/js/runtests.js */

	__export__ function beforeClass(tests : string[]) : void {
		this._tests = tests;
		this._say("1.." + this._tests.length as string);
	}

	__export__ function afterClass() : void {
		if(this._tasks.length == 0) { // synchronous
			this.finish();
		}
		else { // asynchronous
			var next = this._tasks.shift();
			next();
		}
	}

	__export__ function run(name : string, testFunction : function():void) : void {
		name = name.replace(/[$].*$/, "");

		var numAsyncTasks = this._tasks.length;
		this._currentName = name;

		this.setUp();

		try {
			testFunction();
		}
		catch (e : Error) {
			var msg;
			if (e instanceof TestCase.Failure) { // normal failure
				msg = e.message ? " - " + e.message : "";
			}
			else {
				msg = " - failed with exception";
				if (e.message) {
					msg += ": " + e.message;
				}
			}
			this._say("\t" + "not ok " + (++this._count) as string + msg);
			if (e.stack && this.showStackTrace) {
				this.diag(e.stack);
			}
		}

		if(numAsyncTasks == this._tasks.length) { // synchronous
			this.after(name);
		}
		else { // asynchronous
		}
	}

	/* implementation */

	function after(name : string) : void {
		this.tearDown();

		++this._totalCount;
		this._say("\t" + "1.." + this._count as string);

		if(this._count == this._pass) {
			++this._totalPass;
			this._say("ok " + this._totalCount as string +  " - " + name);
		}
		else {
			this._say("not ok " + this._totalCount as string + " - " + name);
		}
		this._count = 0;
		this._pass  = 0;
	}

	function finish() : void {
		if(this._totalCount != this._totalPass) {
			var failed = this._totalCount - this._totalPass;
			this.diag("tests failed "
				+ failed as string
				+ " of "
				+ this._totalCount as string);
		}
	}

	/* async test stuff */

	/**
	 * Prepares an asynchronous test block with a timeout handler.
	 */
	function async(testBody : function(:AsyncContext):void, timeoutHandler : function(:AsyncContext):void, timeoutMS : int) : void {

		var async = new AsyncContext(this, this._currentName, timeoutHandler, timeoutMS);

		this._tasks.push(function() : void {
			this.setUp(async);
			testBody(async);
		});
	}

	/**
	 * Prepares an asynchronous test block.
	 * Automatically call <code>this.fail()</code> on timeout.
	 */
	function async(testBody : function(:AsyncContext):void, timeoutMS : int) : void {
		this.async(testBody, function(async : AsyncContext) : void {
			this.fail("TIMEOUT: " + async.name());
			async.done();
		}, timeoutMS);
	}

	/* matcher factory */

	/**
	 * <p>Creates a test matcher for a value.</p>
	 * <p>Usage: <code>this.expect(testingValue).toBe(expectedValue)</code></p>
	 */
	function expect.<T>(value : T) : TestCase.Matcher {
		++this._count;
		return new TestCase.Matcher(this, value);
	}
	function expect.<T>(value : T, message : string) : TestCase.Matcher {
		++this._count;
		return new TestCase.Matcher(this, value, message);
	}

	function _ok(name : Nullable.<string>) : void {
		++this._pass;

		var s = name != null ? " - " + name :  "";
		this._say("\t" + "ok " + (this._count) as string + s);
	}

	function _nok(name : Nullable.<string>) : void {
		this._nok(name, null, null, null);
	}

	function _nok(
		name : Nullable.<string>,
		op : Nullable.<string>,
		got : variant,
		expected : variant
	) : void {

		var s = name != null ? " - " + name :  "";
		this._say("\t" + "not ok " + this._count as string + s);

		if (op != null) {
			this.diag("comparing with " + op + s.replace(" - ", " for "));
			this._dump("got     :", got);
			this._dump("expected:", expected);
		}
		throw new TestCase.Failure(name != null ? name : "");
	}

	/**
	 * Tells a test passes.
	 */
	function pass(reason : string) : void {
		++this._count;
		++this._pass;

		this._say("\t" + "ok " + (this._count) as string + " - " + reason);
	}

	/**
	 * Tells a test fails.
	 */
	function fail(reason : string) : void {
		++this._count;
		throw new TestCase.Failure(reason);
	}

	function _dump(tag : string, value : variant) : void {
		if(typeof value == "object") {
			this.diag(tag);
			console.dir(value);
		}
		else { // primitive value
			this.diag(tag + " " + value as string);
		}
	}

	function _say(message : string) : void {
		console.info(message);
	}

	function equals(a : variant, b : variant) : boolean {
		return this._equals(a, b, 0);
	}

	function _equals(a : variant, b : variant, recursion : int) : boolean {
		if (++recursion > 1000) {
			throw new RangeError("Deep recursion in equals()");
		}
		if (a == b || (a == null && b == null)) {
			return true;
		}

		// both are Array.<T>
		if (a instanceof Array.<variant>) {
			if (! (b instanceof Array.<variant>)) {
				return false;
			}
			var aryA = a as Array.<variant>;
			var aryB = b as Array.<variant>;
			if (aryA.length != aryB.length) {
				return false;
			}
			for (var i = 0; i < aryA.length; ++i) {
				if (! this._equals(aryA[i], aryB[i], recursion)) {
					return false;
				}
			}
			return true;
		}

		// both are Map.<T>
		if (a instanceof Map.<variant>) {
			if (! (b instanceof Map.<variant>)) {
				return false;
			}
			var mapA = a as Map.<variant>;
			var mapB = b as Map.<variant>;

			var mapAkeys = mapA.keys().sort();
			var mapBkeys = mapB.keys().sort();

			if (mapAkeys.length != mapBkeys.length) {
				return false;
			}

			for (var i = 0; i < mapAkeys.length; ++i) {
				var key = mapAkeys[i];
				if (key != mapBkeys[i]) {
					return false;
				}
				if (! this._equals(mapA[key], mapB[key], recursion)) {
					return false;
				}
			}
			return true;
		}

		// both are Date
		if (a instanceof Date) {
			if (! (b instanceof Date)) {
				return false;
			}
			var dateA = a as Date;
			var dateB = b as Date;
			if (dateA && dateB) {
				return dateA.getTime() == dateB.getTime();
			}
		}

		// XXX: consider serialize():variant
		return false;
	}

	function difflet(a : Array.<variant>, b : Array.<variant>) : string {
		assert a != null;
		assert b != null;

		var s = "[\n";

		for (var i = 0, l = Math.max(a.length, b.length); i < l; ++i) {
			var ai = a[i];
			var bi = b[i];

			var aIsOver = (i   >= a.length);
			var aIsLast = (i+1 >= a.length);

			if (! aIsOver) {
				s += "  " + JSON.stringify(ai);
				if (! aIsLast) {
					s += ",";
				}

				if (ai != bi) {
					// put pretty diff
					s += " // != " + JSON.stringify(bi);
				}
			}
			else {
				s += "  // != " + JSON.stringify(bi);
			}
			s += "\n";
		}

		return s + "]";
	}

	/**
	 * Shows diagnostic messages.
	 */
	function diag(message : string) : void {
		this._say(message.replace(/^/mg, "# "));
	}

	/**
	 * Shows notes on verbose mode.
	 */
	function note(message : string) : void {
		if(this.verbose) {
			this._say(message.replace(/^/mg, "# "));
		}
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

	/**
	 * Assertion Matcher, created by <code>TestCase#expect()</code>
	 */
	class Matcher {

		var _test : TestCase;
		var _got  : variant;
		var _name : Nullable.<string>;

		/**
		 * @private
		 */
		function constructor(test : TestCase, got : variant, name : Nullable.<string> = null) {
			this._test = test;
			this._got  = got;
			this._name = name;
		}

		function toBe(x :  variant) : void {
			this._match(this._got == x,
				this._got, x, "==");
		}
		function notToBe(x :  variant) : void {
			this._match(this._got != x,
				this._got, x, "!=");
		}
		function toBeLT(x :  number) : void {
			this._match(this._got as number < x,
				this._got, x, "<");
		}
		function toBeLE(x :  number) : void {
			this._match(this._got as number <= x,
				this._got, x, "<=");
		}
		function toBeGT(x :  number) : void {
			this._match(this._got as number > x,
				this._got, x, ">");
		}
		function toBeGE(x :  number) : void {
			this._match(this._got as number >= x,
				this._got, x, ">=");
		}

		function toMatch(x : RegExp) : void {
			this._match(x.test(this._got as string),
					this._got, x, "RegExp.test()");
		}
		function notToMatch(x : RegExp) : void {
			this._match(! x.test(this._got as string),
					this._got, x, "! RegExp.test()");
		}

		/**
		 * Tests whether the given collection equals to the expected.
		 */
		function toEqual.<Collection>(x : Collection) : void {
			assert x != null;

			if (! (this._got instanceof Collection)) {
				this._test._nok(this._name, "TestCase#equals()", this._got, x);
				return;
			}

			var got = this._got as Collection;
			if (this._test.equals(got, x)) {
				this._test._ok(this._name);
			}
			else {
				this._test._nok(this._name, "TestCase#equals()", got, x);
				this._test.note(this._test.difflet(got, x));
			}
		}

		function _match(value : boolean, got : variant, expected : variant, op : string) : void {
			if(value) {
				this._test._ok(this._name);
			}
			else {
				this._test._nok(this._name, op, got, expected);
			}
		}

	}

	/**
	 * @private
	 */
	class Failure extends Error {
		function constructor(reason : string) {
			super(reason);
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

	/**
	 * The name of the running test method, e.g. <code>"testAsyncFoo"</code>.
	 */
	function name() : string { return this._name; }

	/*
	 * Tells that the asynchronous test is finished.
	 */
	function done() : void {
		Timer.clearTimeout(this._timerId);

		this._test.tearDown(this);
		this._test.after(this._name);

		if(this._test._tasks.length != 0) {
			var next = this._test._tasks.shift();
			next();
		}
		else {
			this._test.finish();
		}
	}
}


