// an example for class inheritance and interfaces

interface Flyable {
    abstract function fly() : void;
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
    static function main(args : string[]) : void {
        // fo bar
        var bat = new Bat();

        var animal : Animal = bat; // OK. A bat is an animal.
        animal.eat();

        var flyable : Flyable = bat; // OK. A bat can fly
        flyable.fly();

        // for Bee
        var bee = new Bee();

        flyable = bee; // A bee is also flyable
        flyable.fly();
    }
}
