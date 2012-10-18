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

class _Main {
	static function main(args : string[]) : void {
		var h : HasName = new Cat("tama");
		log h._name;
	}
}
