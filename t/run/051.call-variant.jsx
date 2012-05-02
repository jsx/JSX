/*EXPECTED
4
5
*/
class Test {
	static function incr(n : number) : number {
		return n + 1;
	}
	static function run() : void {
		// call while casting
		var f : variant = Test.incr;
		log (f as function (:number):number)(3);
		// assign and then call
		var g : function (:number):number = f as function (:number):number;
		log g(4);
	}
}
