
class Base {
  function f(a : number = 10, b : number = 20) : void {
    log a;
    log b;
  }
}

class Derived extends Base {
  override function f(a : number = 100, b : number = 200) : void {
    log a;
    log b;
  }
}

class _Main {
  static function main(args : string[]) : void {
    new Base().f(42);
    (new Derived() as Base).f(42);
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:

