/*EXPECTED
true
*/
class Test {
	static function run() : void {
		var m = { 'a' : 1 };
		log ! ('b' in m);
	}
}
