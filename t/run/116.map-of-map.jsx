/*EXPECTED
1
*/

class _Main {
	static function main(args : string[]) : void {
		var a = { a: { a: 1 } };
		log a["a"]["a"];
	}
}
