/*EXPECTED
null
null
*/
interface I {
}
mixin M {
}
class Test {
	static function run() : void {
		var i : I = null;
		var o : Object = i;
		log o;
		var m : M = null;
		o = m;
		log o;
	}
}
