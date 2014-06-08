/*JSX_OPTS
--enable-generator-emulation
*/

/***
 * A JSX example to Generator/yield
 */

class _Main {
  static function main(args : string[]) : void {
    function * fib() : void yield number {
      var a = 0, b = 1;
      while (true) {
        yield a;
        var tmp = a;
        a = b;
        b = tmp + b;
      }
    }

    var g = fib();

    for (var i = 0; i < 10; i++) {
      log g.next().value;
    }
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:

