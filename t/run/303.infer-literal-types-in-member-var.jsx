/*EXPECTED
ok
0
*/
class A {
}
class _Main {
	var a : A[] = [];
	var b : Map.<A> = {};
	static function main (args : string[]) : void {
		log "ok";
		log new _Main().a.length;
	}
}
