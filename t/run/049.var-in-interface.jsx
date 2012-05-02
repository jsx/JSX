/*EXPECTED
tama
*/

interface HasName {
	var _name : string;
}

class Cat implements HasName {
	var _name : string;
	function constructor(name : string) {
		this._name = name;
	}
}

class Test {
	static function run() : void {
		var h : HasName = new Cat("tama");
		log h._name;
	}
}
