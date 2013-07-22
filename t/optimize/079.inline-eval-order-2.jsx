/*EXPECTED
A
B#f
x
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
		var x = args.length >= 0; // true
		if (x && new A().b.not(false)) {
			log "x";
		}
		if (!x && new A().b.not(false)) {
			log "y";
		}
	}
}
