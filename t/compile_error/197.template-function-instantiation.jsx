class _Main {
	static function foo.<T>(a : T, b : T) : void {
	}
	static function bar.<T,U>(a : T) : void {
	}
	static function main(args : string[]) : void {
		_Main.foo(1, "2");
		_Main.bar(1);
	}
}
