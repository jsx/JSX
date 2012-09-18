/*EXPECTED
false
false
false
true
false
false
true
true
true
*/
class C {
}
interface I {
}
class _Main extends C implements I {
	static function main(args : string[]) : void {
		var n : Object = null;
		log n instanceof C;
		log n instanceof I;
		log n instanceof _Main;
		log new C() instanceof C;
		log new C() instanceof I;
		log new C() instanceof _Main;
		log new _Main() instanceof C;
		log new _Main() instanceof I;
		log new _Main() instanceof _Main;
	}
}
