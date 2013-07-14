/*EXPECTED
A
false
A
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
	function not(value : boolean) : boolean {
		return !value;
	}
}

// a variation of t/optimize/040
class _Main {
	static function main(args : string[]) : void {
		log new A().b.not(true);
		log new A().b.not(false);
	}
}
