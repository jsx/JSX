/*EXPECTED
0
0
0,0
1
2
1,2
1
2
2,3
2,3
*/
final __array__ class Point {
	var x = 0;
	var y = 0;
	function constructor() {
	}
	function constructor(x : number, y : number) {
		this.x = x;
		this.y = y;
	}
	function constructor(that : Point) {
		this.x = that.x;
		this.y = that.y;
	}
	function getX() : number {
		return this.x;
	}
	function getY() : number {
		return this.y;
	}
	function setX(x : number) : void {
		this.x = x;
	}
	function setY(y : number) : void {
		this.y = y;
	}
	static function toString(that : Point) : string {
		return that.x as string + "," + that.y as string;
	}
}

class Test {
	static function run() : void {
		var p = new Point();
		log p.x;
		log p.y;
		log Point.toString(p);
		p = new Point(1, 2);
		log p.x;
		log p.y;
		log Point.toString(p);
		log p.getX();
		log p.getY();
		p.setX(p.getX() + 1);
		p.setY(p.getY() + 1);
		log Point.toString(p);
		p = new Point(p);
		log Point.toString(p);
	}
}
