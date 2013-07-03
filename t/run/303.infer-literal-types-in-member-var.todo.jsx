/*EXPECTED
ok
*/
class A {
}
class _Main {
	var a : A[]	= [];
	var b : Map.<A> = {};
	static function main (args : string[]) : void {
		log "ok";
	}
}