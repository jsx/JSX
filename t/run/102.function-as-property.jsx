/*EXPECTED
hello
hello
hello
hello
*/

class Test {
	var f : function () : void;
	function constructor() {
		this.f = function () : void {
			log "hello";
		};
	}
	static function run() : void {
		var t = new Test();
		t.f();
		new Test().f();
		var f = t.f;
		f();
		var g : function () : void = t.f;
		g();
	}
}
