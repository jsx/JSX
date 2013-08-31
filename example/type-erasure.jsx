/***
 * An example of duck typing (a.k.a. type erasure)
 */

import "console.jsx";

interface Animal {
    function say () : void;
}

class Duck /* no need to implement AnimalConcept */ {
  function say () : void {
    console.log("quack!");
  }
}

class Dog /* no need to implement AnimalConcept */ {
  function say () : void {
    console.log("bow!");
  }
}

class _AnimalHolder.<T> implements Animal {
	var _target : T;
	function constructor (target : T) {
		this._target = target;
	}
	override function say () : void {
		this._target.say();
	}
}

class Human {
  var _animal : Animal;

  /* A human can hold any kind of object that is capable of `say`ing! */
  function hold.<T> (animal : T) : void {
    this._animal = new _AnimalHolder.<T>(animal);
  }

  function touch () : void {
    this._animal.say();
  }
}

class _Main {
  static function main(args : string[]) : void {
    var human = new Human;
    human.hold(new Duck);
    human.touch(); // => quack!
    human.hold(new Dog);
    human.touch(); // -> bow!
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:

