// to fix the result of test failure
/*EXPECTED
1..3
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
	not ok 2
# comparing with <
# got:      10
# expected: 10
	not ok 3
# comparing with <=
# got:      10
# expected: 9
	not ok 4
# comparing with >
# got:      10
# expected: 10
	not ok 5
# comparing with >=
# got:      10
# expected: 11
	1..5
not ok 2 - testShouldNotBeOK
	ok 1 - just pass
not ok - fail
# just fail
	1..1
ok 3 - testPassFail
# tests failed 1 of 3
*/

import "test-case.jsx";

class _Main {
	static function main(args : string[]) : void {
		var t = new __Main();

		t.beforeClass(["testShouldBeOK", "testShouldNotBeOK", "testPassFail"]);

		t.run("testShouldBeOK", function() : void {
			t.testShouldBeOK();
		});
		t.run("testShouldNotBeOK", function() : void {
			t.testShouldNotBeOK();
		});
		t.run("testPassFail", function() : void {
			t.testPassFail();
		});

		t.afterClass();
	}
}

class __Main extends TestCase {
	function testShouldBeOK() : void {
		this.expect(true, "boolean v.s. boolean").toBe(true);
		this.expect(10).toBeLT(11);
		this.expect(10).toBeLE(10);
		this.expect(10).toBeGT( 9);
		this.expect(10).toBeGE(10);
	}
	function testShouldNotBeOK() : void {
		this.expect(false, "boolean v.s. boolean").toBe(true);
		this.expect(10).toBeLT(10);
		this.expect(10).toBeLE( 9);
		this.expect(10).toBeGT(10);
		this.expect(10).toBeGE(11);
	}

	function testPassFail() : void {
		this.pass("just pass");
		this.fail("just fail");
	}
}
