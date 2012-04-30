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
class Test extends C implements I {
	static function run() : void {
		var n : Object = null;
		log n instanceof C;
		log n instanceof I;
		log n instanceof Test;
		log new C() instanceof C;
		log new C() instanceof I;
		log new C() instanceof Test;
		log new Test() instanceof C;
		log new Test() instanceof I;
		log new Test() instanceof Test;
	}
}
