/*EXPECTED
10
10
*/

class _Main {
	static var foo = 10;
	static var bar = _Main.foo as int;

	static function main(args : string[]) : void {
		log _Main.foo;
		log _Main.bar;
	}
}
