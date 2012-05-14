/*EXPECTED
string
*/

class Test {
	static function run() : void {
		var a : variant = Test.run.toString();
		log typeof a;
	}
}
