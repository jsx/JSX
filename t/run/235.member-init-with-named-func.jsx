/*EXPECTED
Hello, world!
*/

class _Main {
  static var foo = function bar() : string {
    return "Hello, world!";
  };

  static function main(args : string[]) : void {
    log _Main.foo();
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:

