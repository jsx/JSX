/*
 * Point class
 *
 * Usage:
 *  var p = new Point(10, 20);
 *  log p.getX(); // 10
 *  log p.getY(); // 20
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

	// getters
	function getX() : number {
		return this._x;
	}
	function getY() : number {
		return this._y;
	}

	// setters
	function setX(value : number) : void {
		this._x = value;
	}
	function setY(value : number) : void {
		this._y = value;
	}
}

class _Main {
	static function main(args : string[]) : void {
		log "by default constructor:";
		var p = new Point;

		log "x=" + p.getX() as string;
		log "y=" + p.getY() as string;

		log "by new Point(10, 20):";

		p = new Point(10, 20);
		log "x=" + p.getX() as string;
		log "y=" + p.getY() as string;
	}
}
