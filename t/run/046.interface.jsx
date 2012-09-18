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

class _Main {
	static function main(args : string[]) : void {
		new Dog().say();
		new Cat().say();
		var say : Say = new Dog();
		say.say();
		say = new Cat();
		say.say();
	}
}
