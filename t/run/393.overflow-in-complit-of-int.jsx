/*EXPECTED
-1
-1
4294967295
*/
class _Main {
	static function main(args : string[]) : void {
		var a = [ 0xffffffff ] : Array.<int>;
		log a[0];
		var m = { k: 0xffffffff } : Map.<int>;
		log m["k"];
		var v = { k : 0xffffffff } : variant;
		log v["k"];
	}
}
