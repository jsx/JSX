/*EXPECTED
2
object
*/
/*JSX_OPTS
--optimize lto,inline
*/
import "js.jsx";
class _Main {
	static function main(args : string[]) : void {
		var a = [ 1 ];
		a._forEach((n) -> {
			var x = n;
			log x + 1;
			js.eval("console.log(typeof arguments[0])");
		});
	}
}
