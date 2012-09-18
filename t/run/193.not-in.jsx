/*EXPECTED
true
*/
class _Main {
	static function main(args : string[]) : void {
		var m = { 'a' : 1 };
		log ! ('b' in m);
	}
}
