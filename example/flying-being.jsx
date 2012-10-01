// an example for class inheritance and interfaces

interface Flyable {
    function fly() : void;
}

abstract class Animal {
    function eat() : void {
      log "An animal is eating!";
    }
}

class Bat extends Animal implements Flyable {
    override function fly() : void {
        log "A bat is flying!";
    }
}

abstract class Insect {
}

class Bee extends Insect implements Flyable {
    override function fly() : void {
        log "A bee is flying!";
    }
}

class _Main {
    static function takeAnimal(animal : Animal) : void {
        animal.eat();
    }

    static function takeFlyable(flyingBeing : Flyable) : void {
        flyingBeing.fly();
    }

    static function main(args : string[]) : void {
        var bat = new Bat();

        _Main.takeAnimal(bat);  // OK. A bat is an animal.

        _Main.takeFlyable(bat); // OK. A bat can fly.

        var bee = new Bee();

        _Main.takeFlyable(bee); // OK. A bee is also flyable.
    }
}

// vim: set expandtab:
