/*EXPECTED
foo
*/
/*JSX_OPTS
--optimize dce
*/
class _Main {
	static function f() : boolean {
		log "foo";
		return true;
	}

	static function main (args : string[]) : void {
		! _Main.f();
	}
}
