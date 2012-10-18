/*EXPECTED
ok
ok
*/

class _Main {
	static const foo = "ok";

	static const bar = (function() : string {
		return _Main.foo;
	}());

	static function main(args : string[]) : void {
		log _Main.foo;
		log _Main.bar;
	}
}
