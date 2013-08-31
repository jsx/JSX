/***
 * An example of duck typing (a.k.a. type erasure)
 */

import "console.jsx";

interface AnimalConcept {
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

class Human {
  class _AnimalHolder.<T> implements AnimalConcept {
    var _target : T;
    function constructor (target : T) {
      this._target = target;
    }
    override function say () : void {
      this._target.say();
    }
  }

  var _animal : AnimalConcept;

  function constructor(animal : AnimalConcept) {
    this._animal = animal;
  }

  static function make.<Animal> (target : Animal) : Human {
    return new Human(new Human._AnimalHolder.<Animal>(target));
  }

  function touch () : void {
    this._animal.say();
  }
}

class _Main {
  static function main(args : string[]) : void {
    var duck = new Duck;
    var dog  = new Dog;

    var human1 = Human.make(duck);
    human1.touch(); // -> quack!

    var human2 = Human.make(dog);
    human2.touch(); // -> bow!
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:

