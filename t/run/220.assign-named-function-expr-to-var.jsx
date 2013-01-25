/*EXPECTED
foo
*/

class _Main {
  static function main(args : string[]) : void {
    var foo = function foo() : void {
      var a = foo;
      log "foo";
    };
    foo();
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:

