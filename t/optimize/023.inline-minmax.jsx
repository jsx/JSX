/*EXPECTED
1
2
*/
/*JSX_OPTS
--optimize inline
*/
class Test {
	static function min(x : number, y : number) : number {
		return Math.min(x, y);
	}
	static function run() : void {
		log Test.min(1, 2);
		log Math.max(1, 2);
	}
}
