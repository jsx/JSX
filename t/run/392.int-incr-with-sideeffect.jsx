/*EXPECTED
-2147483648
-2147483648
2147483647
2147483647
-2147483648
2147483647
2147483647
-2147483648
-2147483648
*/
class _Main {
	static function getIndex() : number {
		return 0;
	}
	static function main(args : string[]) : void {
		var a = [ -2147483648 ] : Array.<int>;
		// the following code would use the wrapper functions since JSX does not perform inter-function optimizations by default
		log a[0];
		var n : number = a[__CLASS__.getIndex()]--;
		log n;
		log a[0];
		n = a[__CLASS__.getIndex()]++;
		log n;
		log a[0];
		n = --a[__CLASS__.getIndex()];
		log n;
		log a[0];
		n = ++a[__CLASS__.getIndex()];
		log n;
		log a[0];
	}
}
