/*EXPECTED
2
0
hello
1
hola
1
*/
class _Main {
	static var a = [ 3 ] : int[];
	static function f() : int[] {
		log "hello";
		return _Main.a;
	}
	var m : int = 3;
	function g() : _Main {
		log "hola";
		return this;
	}
	static function main(args : string[]) : void {
		var i : int = 4;
		i /= 2;
		log i;
		i = 1;
		i /= 3;
		log i;
		_Main.f()[0] /= 2;
		log _Main.a[0];
		var t = new _Main;
		t.g().m /= 2;
		log t.m;
	}
}
