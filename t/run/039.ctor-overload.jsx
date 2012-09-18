/*EXPECTED
0,0
1,2
*/
class Point {
	var _x = 0;
	var _y = 0;
	function constructor() {
	}
	function constructor(x : number, y : number) {
		this._x = x;
		this._y = y;
	}
	function say() : void {
		log this._x.toString() + "," + this._y.toString();
	}
}

class _Main {
	static function main(args : string[]) : void {
		new Point().say();
		new Point(1, 2).say();
	}
}
