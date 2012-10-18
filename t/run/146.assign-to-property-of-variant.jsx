/*EXPECTED
abc
*/

class _Main {
	static function main(args : string[]) : void {
		var a : variant = {} : Map.<variant>;
		a["a"] = "abc";
		log a["a"];
	}
}
