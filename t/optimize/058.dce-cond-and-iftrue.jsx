/*EXPECTED
foo
bar
*/
/*JSX_OPTS
--optimize dce
*/
class _Main {
	static function f() : boolean {
		log "foo";
		return true;
	}
	static function g() : boolean {
		log "bar";
		return true;
	}

	static function main (args : string[]) : void {
		_Main.f() ? _Main.g() : false;
	}
}
