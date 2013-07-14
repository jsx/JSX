/*EXPECTED
A
false
A
B#f
true
*/
/*JSX_OPTS
--optimize inline
*/
final class A {
	var b = new B;

	function constructor() {
		log "A";
	}
}

final class B {
	function f() : boolean {
		log "B#f";
		return true;
	}
	function not(value : boolean) : boolean {
		return !value && this.f();
	}
}

// a variation of t/optimize/040
class _Main {
	static function main(args : string[]) : void {
		log new A().b.not(true);
		log new A().b.not(false);
	}
}
