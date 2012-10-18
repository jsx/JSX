/*EXPECTED
1,2,red
3,4,black
*/

class Point {
	var _x : number;
	var _y : number;
	function constructor(x : number, y : number) {
		this._x = x;
		this._y = y;
	}
	override function toString() : string {
		return this._x.toString() + "," + this._y.toString();
	}
}

class Pixel extends Point {
	var _color : string;
	function constructor(x : number, y : number, color : string) {
		super(x, y); // call-by-keyword
		this._color = color;
	}
	function constructor(x : number, y : number) {
		Point(x, y); // call-by-name
		this._color = "black";
	}
	override function toString() : string {
		return super.toString() + "," + this._color;
	}
}

class _Main {
	static function main(args : string[]) : void {
		var p = new Pixel(1, 2, "red");
		log p.toString();
		p = new Pixel(3, 4);
		log p.toString();
	}
}
