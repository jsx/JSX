/*EXPECTED
2
3
2
*/
/*JSX_OPTS
--optimize inline
*/

class Test {
	static function incr(n : number) : number {
		return n + 1;
	}
	static function run() : void {
		var ret = Test.incr(1);
		log ret;
		var n = 2;
		ret = Test.incr(n);
		log ret;
		log n;
		
	}
}
