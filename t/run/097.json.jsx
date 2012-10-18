/*EXPECTED
foo
["foo"]
*/

class _Main {
	static function main(args : string[]) : void {
		var a = JSON.parse('["foo"]') as string[];
		log a.join(",");

		log JSON.stringify(a);
	}
}
