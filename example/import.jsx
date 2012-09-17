import "./fib.jsx";
import "test-case.jsx";

class _Main {
	static function main(args : string[]) : void {
		log "fib(10)=" + Fib.fib1(10).toString();
	}
}

class _Test extends TestCase {
	function testFib1() : void {
		this.expect(Fib.fib1(10)).toBe(55);
	}
	function testFib2() : void {
		this.expect(Fib.fib2(10)).toBe(55);
	}
	function testFib3() : void {
		this.expect(Fib.fib3(10)).toBe(55);
	}
	function testFib4() : void {
		this.expect(Fib.fib4(10)).toBe(55);
	}
}

