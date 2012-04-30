// import "test-simple"

class Test extends TestCase {
    function run() :void {
        // just signature tests
        this.expect(Math.E > 0, "E").toBe(true);
        this.expect(Math.LN10 > 0, "LN10").toBe(true);
        this.expect(Math.LN2 > 0, "LN2").toBe(true);
        this.expect(Math.LOG2E > 0, "LN2E").toBe(true);
        this.expect(Math.LOG10E > 0, "LN10E").toBe(true);
        this.expect(Math.PI > 0, "PI").toBe(true);
        this.expect(Math.SQRT1_2 > 0, "SQRT1_2").toBe(true);
        this.expect(Math.SQRT2 > 0, "SQRT2").toBe(true);

        this.expect(Math.abs(-42), "abs").toBe(42);
        this.expect(Math.acos(-42), "acos").toBe(0);
        /*
        this.expect(Math.asin(0), "asin").toBe(0);
        this.expect(Math.atan(0), "atan").toBe(0);
        this.expect(Math.atan2(0, 2), "atan2").toBe(0);
        */

        this.done();
    }
}
