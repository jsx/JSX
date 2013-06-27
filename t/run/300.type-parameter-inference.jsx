/*EXPECTED
[ 1, 4, 9 ]
*/
class _Main {
	static function main (args : string[]) : void {
		var a = [1,2,3];
		log a.map((i : number) -> {
			return i * i;
		});
	}
}