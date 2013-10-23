/*JSX_OPTS
--optimize staticize
*/
/*EXPECTED
Base#f:0
*/
class Base {
  var n = 0;
  function f() : void {
    log "Base#f:" + this.n as string;
  }
}

final class Derived extends Base {
  function g() : void {
    super.f();
  }
}

class _Main {
  static function main(args : string[]) : void {
    var d = new Derived;
    d.g();
  }
}
