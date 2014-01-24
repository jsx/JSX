/*EXPECTED
3
hello world
*/
import "js.jsx";
class _Main {
	static function main(args : string[]) : void {
		var f = js.newFunction("a", "b", "return a + b") as function (: variant, : variant) : variant;
		log f(1, 2);
		log f("hello ", "world");
	}
}
