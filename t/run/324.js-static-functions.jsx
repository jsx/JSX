/*EXPECTED
3
ff
*/
import "js.jsx";

class _Main {
	static function main (args : string[]) : void {
		var f = js.eval;
		log f("1 + 2");

		var g = js.invoke;
		log g(0xFF, "toString", [16] : variant[]);
	}
}
