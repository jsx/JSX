/*EXPECTED
(124975000000,249975000000)
*/
/*JSX_OPTS
--optimize lto,inline,unclassify
*/
/*BENCHMARK
1
*/

class Point {
	var x : number;
	var y : number;

	function constructor(x : number, y : number) {
		this.x = x;
		this.y = y;
	}

	function add(other : Point) : void {
		this.x += other.x;
		this.y += other.y;
	}

	function serialize() : string {
		return "(" + this.x as string + "," + this.y as string + ")";
	}
}

class _Main {
	static function loop(cnt : number) : void {
		var v = new Point(0, 0);

		for (var i = 0; i < 5000; ++i) {
			for (var j = 0; j < cnt; ++j) {
				v.add(new Point(i, j));
			}
		}
		log v.serialize();
	}
	static function main(args : string[]) : void {
		_Main.loop(("100" + "00") as number);
	}
}
