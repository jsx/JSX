/*EXPECTED
I am Alice
I am Bob
*/
interface Say {
	abstract function say() : void;
}

mixin SayName {
	abstract var _name : string;
	override function say() : void {
		log "I am " + this._name;
	}
}

class Human implements Say, SayName {
	var _name : string;
	function constructor(name : string) {
		this._name = name;
	}
}

class Test {
	static function run() : void {
		var o : Say = new Human("Alice");
		o.say();
		new Human("Bob").say();
	}
}
