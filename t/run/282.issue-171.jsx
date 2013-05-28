/*EXPECTED
ok
*/
class Outer {
	class Inner extends Outer {
	}
}
class _Main {
	static function main (args : string[]) : void {
		log "ok";
	}
}