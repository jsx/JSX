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

class Test extends Base.<Test> {
	static function run() : void {
		(new Test).doit();
		(new Test).doit_noconvert();
	}
	function hello() : void {
		log "hello";
	}
	function goodbye() : void {
		log "goodbye";
	}
}
