/*EXPECTED
2
0
hello
1
hola
1
*/
class Test {
	static var a = [ 3 ] : int[];
	static function f() : int[] {
		log "hello";
		return Test.a;
	}
	var m : int = 3;
	function g() : Test {
		log "hola";
		return this;
	}
	static function run() : void {
		var i : int = 4;
		i /= 2;
		log i;
		i = 1;
		i /= 3;
		log i;
		Test.f()[0] /= 2;
		log Test.a[0];
		var t = new Test;
		t.g().m /= 2;
		log t.m;
	}
}
