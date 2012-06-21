/*EXPECTED
abc
*/

class Test {
	static function run() : void {
		var a : variant = {} : Map.<variant>;
		a["a"] = "abc";
		log a["a"];
	}
}
