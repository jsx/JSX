/*EXPECTED
3 2
*/
/*JSX_OPTS
--optimize unbox
*/
class Point {
	var x : number;
	var y : number;
	function constructor(x : number, y : number) {
		var _x = x;
		var _y = y;
		this.x = _x;
		this.y = _y;
	}
}
class _Main {
	static function main(args : string[]) : void {
		var pt = new Point(1, 2);
		pt.x += 2;
		log pt.x, pt.y;
	}
}
