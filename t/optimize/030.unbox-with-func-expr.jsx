/*EXPECTED
2 2
*/
/*JSX_OPTS
--optimize unbox
*/
class Point {
	var x : number;
	var y : number;
	function constructor(x : number, y : number) {
		this.x = x;
		this.y = y;
	}
}
class _Main {
	static function main(args : string[]) : void {
		var pt = new Point(1, 2);
		(function():void {
			// intentionally empty
		}());
		pt.x += 1;
		log pt.x, pt.y;
	}
}
