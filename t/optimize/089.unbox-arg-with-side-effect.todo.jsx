/*EXPECTED
1
2
3 2
*/
/*JSX_OPTS
--optimize unbox
*/
class Point {
	var x : number;
	var y : number;
	function constructor(x : number, y : number) {
		this.y = y;
		this.x = x;
	}
}
class _Main {
	static function f(n : number) : number {
		log n;
		return n;
	}
	static function main(args : string[]) : void {
		var pt = new Point(_Main.f(1), _Main.f(2));
		pt.x += 2;
		log pt.x, pt.y;
	}
}
