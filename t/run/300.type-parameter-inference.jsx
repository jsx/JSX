/*EXPECTED
1,4,9
1,2,3
*/
class _Main {
	static function main (args : string[]) : void {
		var a = [1,2,3];
		log a.map(function (i : number) {
			return i * i;
		}).join(",");
		log a.reduce(function (prev : string, i : number) {
			return prev == "" ? i as string : prev + "," + i;
		}, "");
	}
}
