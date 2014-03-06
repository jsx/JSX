/*EXPECTED
2
object
*/
/*JSX_OPTS
--optimize lto,inline
*/
import "js.jsx";
class _Main {
	inline static function touch(n : Nullable.<number>) : void {
		var x = n;
		log x + 1;
		js.eval("console.log(typeof arguments[0])");
	}
	static function main(args : string[]) : void {
		var a = [ 1 ];
		a._forEach(_Main.touch);
	}
}
