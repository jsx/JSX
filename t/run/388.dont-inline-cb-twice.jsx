/*EXPECTED
number
number
*/
/*JSX_OPTS
--optimize lto,inline
*/
import "js.jsx";
class _Main {
	inline static function forEachTwice(a : number[], cb : (Nullable.<number>) -> void) : void {
		for (var i = 0; i != a.length; ++i) {
			cb(a[i]);
			cb(a[i]);
		}
	}
	static function main(args : string[]) : void {
		/*
		 * note: the test asserts that the cb arg is not inline-expanded twice by the inline optimizer
		 * but instead is stored to a local var.  However it would be good if the inline optimizer can
		 * laterwards check through the code and expand local functions inline if it seems benefitial.
		 */
		var a = [ 1 ];
		_Main.forEachTwice(a, function (n) {
		       js.eval("console.log(typeof arguments[0]);");
		});
	}
}
