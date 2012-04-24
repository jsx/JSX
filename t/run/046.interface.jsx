/*EXPECTED
woof
mew
woof
mew
nothing to say
*/
interface Say {
	function say() : void {
		log "nothing to say";
	}
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

class Silent implements Say {
}

class Test {
	static function run() : void {
		new Dog().say();
		new Cat().say();
		var say : Say = new Dog();
		say.say();
		say = new Cat();
		say.say();
		say = new Silent();
		say.say();
	}
}
