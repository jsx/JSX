/*EXPECTED
I am Alice
I am Bob
*/
interface Say {
  abstract function say() : void;
}

interface SayName implements Say {
  abstract var _name : string;
  override function say() : void {
    log "I am " + this._name;
  }
}

class Human implements SayName {
  var _name : string;
  function initialize(name : string) {
    this._name = name;
  }
}

class Test {
  static function run() : void {
    new Human("Alice").say();
    new Human("Bob").say();
  }
}
