/*EXPECTED
25
*/

class Base {
	function constructor() { }

	function calculate(x : number) : number {
		return x + 5;
	}
}

class Derived extends Base {
	override function calculate(x : number) : number {
		return super.calculate(x) + 10;
	}
}

class Test {
	static function run() : void {
		var d = new Derived();
		log d.calculate(10);
	}
}

