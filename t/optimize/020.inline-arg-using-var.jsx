/*EXPECTED
abc
*/
/*JSX_OPTS
--optimize inline
*/

class Test {
	var s = "ab";
	static function f(s : string) : string {
		return s + "c";
	}
	static function run() : void {
		var s = Test.f(new Test().s);
		log s;
	}
}
