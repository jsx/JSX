/*EXPECTED
foo
["foo"]
*/

class Test {
	static function run() : void {
		var a = JSON.parse('["foo"]') as string[];
		log a.join(",");

		log JSON.stringify(a);
	}
}
