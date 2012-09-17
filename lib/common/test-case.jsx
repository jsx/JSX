/*
 * Copyright (c) 2012 DeNA Co., Ltd.
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
 * @author DeNA., Co., Ltd.
 * @version 1.0.0
 */

/* SYNOPSIS
import "test-case.jsx";
import "timer.jsx";

class _Test extends TestCase {

	// synchrounous tests

	function testClearTimeout() : void {
		var id = Timer.setTimeout(function() : void {
			this.fail("setTimeout called after clearTimeout");
		}, 1);
		Timer.clearTimeout(id);

		this.expect(id, "clearTimeout").toBe(id);
	}

	// asynchronous tests

	function testSetTimeout() : void {
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
}
*/

import "timer.jsx";
import "console.jsx";

/**
 * Base class for test cases
 */
class TestCase {
	// TODO turn off when the process has no tty
	static var verbose = true;

	var _totalCount = 0;
	var _totalPass  = 0;
	var _count = 0;
	var _pass  = 0;
	var _tests : string[];

	// async stuff
	var _currentName : Nullable.<string>;
	var _tasks = [] : Array.<function():void>; // async tasks

	/* hooks called by src/js/runtests.js */

	function beforeClass(tests : string[]) : void {
		this._tests = tests;
		this._say("1.." + this._tests.length as string);
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
	 * Prepares an asynchronous test a with timeout handler.
	 */
	function async(testBody : function(:AsyncContext):void, timeoutHandler : function(:AsyncContext):void, timeoutMS : int) : void {

		var async = new AsyncContext(this, this._currentName, timeoutHandler, timeoutMS);

		this._tasks.push(function() : void {
			testBody(async);
		});
	}

	/**
	 * Prepares an asynchronous test. Automatically call <code>this.fail()</code> on timeout.
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
	 * <p>Usage: <code>this.expect(testingValue).tobe(expectedValue)</code></p>
	 */
	function expect(value : variant) : _Matcher {
		++this._count;
		return new _Matcher(this, value);
	}
	function expect(value : variant, message : string) : _Matcher {
		++this._count;
		return new _Matcher(this, value, message);
	}

	function _ok(name : Nullable.<string>) : void {
		++this._pass;

		var s = name != null ? " - " + name :  "";
		this._say("\t" + "ok " + (this._count) as string + s);
	}

	function _nok(
		name : Nullable.<string>,
		op : string,
		got : variant,
		expected : variant
	) : void {

		var s = name != null ? " - " + name :  "";
		this._say("\t" + "not ok " + (this._count) as string + s);

		this.diag("comparing with " + op + s.replace(" - ", " for "));
		this._dump("got:      ", got);
		this._dump("expected: ", expected);
	}

	/**
	 * Tells the test case that a test passes.
	 */
	function pass(reason : string) : void {
		++this._count;
		++this._pass;

		this._say("\t" + "ok " + (this._count) as string + " - " + reason);
	}

	/**
	 * Tells the test case that a test fails.
	 */
	function fail(reason : string) : void {
		this._say("not ok - fail");
		this.diag(reason);
	}

	function _dump(tag : string, value : variant) : void {
		if(typeof value == "object" && value as Object != null) {
			this.diag(tag);
			console.dir(value);
		}
		else { // primitive value
			this.diag(tag + value as string);
		}
	}

	function _say(message : string) : void {
		console.info(message);
	}

	/**
	 * Shows diagnostic messages.
	 */
	function diag(message : string) : void {
		this._say(message.replace(/^/mg, "# "));
	}

	/**
	 * Shows notes.
	 */
	function note(message : string) : void {
		if(TestCase.verbose) {
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

	/*
	 * Tells the test case that the asynchronous test is finished.
	 */
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

class _Matcher {

	var _test : TestCase;
	var _got  : variant;
	var _name : Nullable.<string>;

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
			this._test._nok(this._name, op, got, expected);
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
}

