/*EXPECTED
3
3
*/
class A {
	function constructor(a : int) {
		this._a = a;
	}
	function get() : int {
		return this._a;
	}
	var _a : int;
}

class Test {
	static function run() : void {
		var a = new A(3);
		log a._a;
		log a.get();
	}
}
