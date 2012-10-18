/*EXPECTED
hello
hello
hello
hello
*/

class _Main {
	var f : function () : void;
	function constructor() {
		this.f = function () : void {
			log "hello";
		};
	}
	static function main(args : string[]) : void {
		var t = new _Main();
		t.f();
		new _Main().f();
		var f = t.f;
		f();
		var g : function () : void = t.f;
		g();
	}
}
