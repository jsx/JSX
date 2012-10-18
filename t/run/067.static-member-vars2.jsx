/*EXPECTED
ok
*/

class _Main {
	static var foo = 10;
	static var bar = _Main.foo as int;

	static function main(args : string[]) : void {
		log "ok";
	}
}
