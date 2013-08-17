/*EXPECTED
ok
0
0
*/
class A {
}
class _Main {
	var a : A[] = [];
	var b : Map.<A> = {};
	static function main (args : string[]) : void {
		log "ok";
		log A.length;
		log b.keys().length;
	}
}
