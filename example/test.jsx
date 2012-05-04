
import "fib.jsx";

class _Main {
	static function main(args : string[]) : void {
		log "fib(10)=" + Fib.fib1(10).toString();
	}
}

class _Test {
	function test_main() : void {
		log "1..1";
		log "ok 1";
	}
}

/*EXPECTED
fib(10)=55
*/
