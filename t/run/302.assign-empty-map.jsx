/*EXPECTED
ok
*/
class A {
}
class _Main {
	static function main (args : string[]) : void {
		var a : Map.<A> = {};
		log "ok";
	}
}