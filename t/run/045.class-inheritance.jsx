/*EXPECTED
woof
mew
woof
mew
*/

abstract class Animal {
	abstract function say() : void;
}

class Dog extends Animal {
	override function say() : void {
		log "woof";
	}
}

class Cat extends Animal {
	override function say() : void {
		log "mew";
	}
}

class _Main {
	static function main(args : string[]) : void {
		new Dog().say();
		new Cat().say();
		var animal : Animal = new Dog();
		animal.say();
		animal = new Cat();
		animal.say();
	}
}
