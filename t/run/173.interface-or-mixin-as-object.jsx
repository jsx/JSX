/*EXPECTED
true
true
*/
interface I {
}
mixin M {
}
class Test {
	static function run() : void {
		var i : I = null;
		var o : Object = i;
		log o == null;
		var m : M = null;
		o = m;
		log o == null;
	}
}
