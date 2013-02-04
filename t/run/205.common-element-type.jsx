/*EXPECTED
1
1
*/
class _Main {
	static function main(args : string[]) : void {
		var x = [1, null, "string"];
		var y = {"a" : 1, "b" : null, "c" : "string"};
		log x[0];
		log y["a"];
	}
}