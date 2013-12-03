class _Main {
	static function foo () : (number) -> number {
		return (x : number) : number -> {
			return x + 1;
		};
	}
	static function main (args : string[]) : void {
		log _Main.foo()(1);
	}
}
