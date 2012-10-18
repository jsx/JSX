/*EXPECTED
foo
bar0
foo
bar1
*/
class _Main {
	static function foo() : void {
		log "foo";
	}
	static function bar() : void {
		log "bar0";
	}
	static function bar(i : int) : void {
		log "bar1";
	}
	static function main(args : string[]) : void {
		var f = _Main.foo;
		f();
		f = _Main.bar;
		f();
		var g : function () : void = _Main.foo;
		g();
		var h : function (:int):void = _Main.bar;
		h(0);
	}
}
