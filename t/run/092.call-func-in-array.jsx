/*EXPECTED
hello
*/

class Test {
	static function f() : void {
		log "hello";
	}
	static function run() : void {
		var a = [ Test.f ];
		a[0]();
	}
}
