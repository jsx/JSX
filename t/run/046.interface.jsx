/*EXPECTED
woof
mew
woof
mew
*/
interface Say {
	function say() : void;
}

class Dog implements Say {
	override function say() : void {
		log "woof";
	}
}

class Cat implements Say {
	override function say() : void {
		log "mew";
	}
}

class Test {
	static function run() : void {
		new Dog().say();
		new Cat().say();
		var say : Say = new Dog();
		say.say();
		say = new Cat();
		say.say();
	}
}
