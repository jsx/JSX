/*EXPECTED
4
abcdef
*/
class Adder.<T> {
	var result : T;
	function constructor(x : T, y : T) {
		var r = x + y;
		this.result = r;
	}
}

class Test {
	static function run() : void {
		var f = new Adder.<number>(1, 3);
		log f.result;
		var g = new Adder.<string>("abc", "def");
		log g.result;
	}
}
