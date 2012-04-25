/*EXPECTED
1,2,red
3,4,black
*/

class Point {
	var _x : number;
	var _y : number;
	function initialize(x : number, y : number) {
		this._x = x;
		this._y = y;
	}
}

class Pixel extends Point {
	var _color : string;
	function initialize(x : number, y : number, color : string) {
		super(x, y); // call-by-keyword
		this._color = color;
	}
	function initialize(x : number, y : number) {
		Point(x, y); // call-by-name
		this._color = "black";
	}
	function say() : void {
		// FIXME call super.say()
		log this._x.toString() + "," + this._y.toString() + "," + this._color;
	}
}

class Test {
	static function run() : void {
		var p = new Pixel(1, 2, "red");
		p.say();
		p = new Pixel(3, 4);
		p.say();
	}
}
