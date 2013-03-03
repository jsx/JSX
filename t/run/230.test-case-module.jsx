// to fix the result of test failure
/*EXPECTED
1..12
	ok 1 - boolean v.s. boolean
	ok 2
	ok 3
	ok 4
	ok 5
	1..5
ok 1 - testShouldBeOK
	not ok 1 - boolean v.s. boolean
# comparing with == for boolean v.s. boolean
# got:      false
# expected: true
	not ok 2 - boolean v.s. boolean
	1..2
not ok 2 - testShouldNotBeOK_toBe
	not ok 1
# comparing with <
# got:      10
# expected: 10
	not ok 2
	1..2
not ok 3 - testShouldNotBeOK_toBeLT
	not ok 1
# comparing with <=
# got:      10
# expected: 9
	not ok 2
	1..2
not ok 4 - testShouldNotBeOK_toBeLE
	not ok 1
# comparing with >
# got:      10
# expected: 10
	not ok 2
	1..2
not ok 5 - testShouldNotBeOK_toBeGT
	not ok 1
# comparing with >=
# got:      10
# expected: 11
	not ok 2
	1..2
not ok 6 - testShouldNotBeOK_toBeGE
	ok 1
	ok 2
	1..2
ok 7 - testExpectToMatch
	ok 1 - just pass
	1..1
ok 8 - testPass
	not ok 2 - just fail
	1..2
not ok 9 - testFail
	not ok 1 - failed with exception: stop
	1..1
not ok 10 - testStopWithException
# this is diag
	1..0
ok 11 - testDiag
# this is note
	1..0
ok 12 - testNote
# tests failed 7 of 12
*/

import "test-case.jsx";
import "console.jsx";

class T {
	var name : string;
	var cb   : function():void;
	function constructor(name : string, cb : function():void) {
		this.name = name;
		this.cb   = cb;
	}
}

class _Main {
	static function main(args : string[]) : void {
		var t = new _Test();

		var tests = [
			new T("testShouldBeOK", () -> { t.testShouldBeOK(); }),
			new T("testShouldNotBeOK_toBe", () -> { t.testShouldNotBeOK_toBe(); }),
			new T("testShouldNotBeOK_toBeLT", () -> { t.testShouldNotBeOK_toBeLT(); }),
			new T("testShouldNotBeOK_toBeLE", () -> { t.testShouldNotBeOK_toBeLE(); }),
			new T("testShouldNotBeOK_toBeGT", () -> { t.testShouldNotBeOK_toBeGT(); }),
			new T("testShouldNotBeOK_toBeGE", () -> { t.testShouldNotBeOK_toBeGE(); }),
			new T("testExpectToMatch", () -> { t.testExpectToMatch(); }),
			new T("testPass", () -> { t.testPass(); }),
			new T("testFail", () -> { t.testFail(); }),
			new T("testStopWithException", () -> { t.testStopWithException(); }),
			new T("testDiag", () -> { t.testDiag(); }),
			new T("testNote", () -> { t.testNote(); })

		];
		t.beforeClass(tests.map.<string>((item) -> item.name));

		tests.forEach((item) -> {
			t.run(item.name, item.cb);
		});

		t.afterClass();
	}
}

class _Test extends TestCase {
	function constructor() {
		this.showStackTrace = false;
		this.verbose        = true;
	}

	function testShouldBeOK() : void {
		this.expect(true, "boolean v.s. boolean").toBe(true);
		this.expect(10).toBeLT(11);
		this.expect(10).toBeLE(10);
		this.expect(10).toBeGT( 9);
		this.expect(10).toBeGE(10);
	}

	// test failure throws error
	function testShouldNotBeOK_toBe() : void {
		this.expect(false, "boolean v.s. boolean").toBe(true);
	}

	function testShouldNotBeOK_toBeLT() : void {
		this.expect(10).toBeLT(10);
		this.diag("not reached");
	}

	function testShouldNotBeOK_toBeLE() : void {
		this.expect(10).toBeLE( 9);
		this.diag("not reached");
	}

	function testShouldNotBeOK_toBeGT() : void {
		this.expect(10).toBeGT(10);
		this.diag("not reached");
	}

	function testShouldNotBeOK_toBeGE() : void {
		this.expect(10).toBeGE(11);
		this.diag("not reached");
	}

	function testExpectToMatch() : void {
		this.expect("hoge").toMatch(/.og./);
		this.expect("hoge").notToMatch(/.xg./);
	}

	function testPass() : void {
		this.pass("just pass");
	}

	function testFail() : void {
		this.fail("just fail");
		this.diag("not reached");
	}

	function testStopWithException() : void {
		throw new Error("stop");
	}

	function testDiag() : void {
		this.diag("this is diag");
	}

	function testNote() : void {
		this.note("this is note");
		this.verbose = false;
		this.note("this is note, but won't be shown");
	}
}
