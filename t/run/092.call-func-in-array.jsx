/*EXPECTED
hello
detected assignment of 'undefined' to type 'function () : void'
*/

class Test {
	static function f() : void {
		log "hello";
	}
	static function run() : void {
		var a = [ Test.f ];
		a[0]();
		a[1]();
	}
}
