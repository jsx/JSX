/*EXPECTED
hello
goodbye
*/

class Base.<T> {
	function doit() : void {
		(this as T).hello();
	}
	function doit_noconvert() : void {
		(this as __noconvert__ T).goodbye();
	}
}

class _Main extends Base.<_Main> {
	static function main(args : string[]) : void {
		(new _Main).doit();
		(new _Main).doit_noconvert();
	}
	function hello() : void {
		log "hello";
	}
	function goodbye() : void {
		log "goodbye";
	}
}
