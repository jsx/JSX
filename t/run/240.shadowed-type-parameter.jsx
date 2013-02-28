/*EXPECTED
0
*/
class Outer.<T> {
	class Inner.<T> {
		var m : T;
	}
}
class _Main {
	static function main(args : string[]) : void {
		var m = new Outer.<string>.Inner.<number>;
		log m.m;
	}
}