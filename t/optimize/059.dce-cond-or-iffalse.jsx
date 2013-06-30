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
		return false;
	}
	static function g() : boolean {
		log "bar";
		return true;
	}

	static function main (args : string[]) : void {
		_Main.f() ? true : _Main.g();
	}
}
