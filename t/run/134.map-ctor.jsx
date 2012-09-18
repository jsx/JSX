/*EXPECTED
3
undefined
*/

class _Main {
	static function main(args : string[]) : void {
		var m = new Map.<number>;
		m["a"] = 3;
		log m["a"];
		log m["b"];
	}
}
