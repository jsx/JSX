/*EXPECTED
0
1
undefined
*/
import "js.jsx";

class _Main {
	static var i : int = 0;
	static var s1 = _Main.i++;
	static var s2 = _Main.i++;
	static function main(args : string[]) : void {
		log _Main.s1;
		log _Main.s2;
		log typeof js.global["$__jsx_postinc_t"];
	}
}
