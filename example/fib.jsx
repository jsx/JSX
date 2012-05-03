class Fib {

	static function fib1(n : int) : int {
		if (n <= 2)
			return 1;
		else
			return Fib.fib1(n - 1) + Fib.fib1(n - 2);
	}

	static function fib2(n : number) : number {
		return n <= 2 ? 1 : Fib.fib2(n - 1) + Fib.fib2(n - 2);
	}

	static function fib3(n : int) : int {
		if (n <= 2)
			return 1;
		var value = 1;
		var prevValue = 1;
		for (var i = 3; i <= n; i++) {
			var t = value + prevValue;
			prevValue = value;
			value = t;
		}
		return value;
	}

	static function fib4(n : int) : int {
		switch (n) {
		case 1:
			return 1;
		case 2:
			return 1;
		default:
			return Fib.fib4(n - 1) + Fib.fib4(n - 2);
		}
	}
}

class _Test {
	function test_fib1() : void {
		log "fib1(10) = " + Fib.fib1(10).toString();
	}
	function test_fib2() : void {
		log "fib2(10) = " + Fib.fib2(10).toString();
	}
	function test_fib3() : void {
		log "fib3(10) = " + Fib.fib3(10).toString();
	}
	function test_fib4() : void {
		log "fib4(10) = " + Fib.fib4(10).toString();
	}
}

