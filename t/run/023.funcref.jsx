/*EXPECTED
foo
bar0
foo
bar1
*/
class Test {
	static function foo() : void {
		log "foo";
	}
	static function bar() : void {
		log "bar0";
	}
	static function bar(i : int) : void {
		log "bar1";
	}
	static function run() : void {
		var f = Test.foo;
		f();
		f = Test.bar;
		f();
		var g : function () : void = Test.foo;
		g();
		var h : function (:int):void = Test.bar;
		h(0);
	}
}
