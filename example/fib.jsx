package com.example.fib;

class Fib {
	static function fib1(n : Int) : Int {
		if (n < 2)
			return 1;
		else
			return Fib.fib1(n - 1) + Fib.fib1(n - 2);
	}
	static function fib2(n : Int) : Int {
		return n < 2 ? 1 : Fib.fib2(n - 1) + Fib.fib2(n - 2);
	}
}
