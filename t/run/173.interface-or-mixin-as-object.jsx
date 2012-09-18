/*EXPECTED
true
true
*/
interface I {
}
mixin M {
}
class _Main {
	static function main(args : string[]) : void {
		var i : I = null;
		var o : Object = i;
		log o == null;
		var m : M = null;
		o = m;
		log o == null;
	}
}
