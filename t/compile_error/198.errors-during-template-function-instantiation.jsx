class _Main {
	static function foo.<T> (a : T) : void {
		a.foo();	// is an error
	}
	static function main (args : string[]) : void {
		_Main.foo.<number>(1);
	}
}
