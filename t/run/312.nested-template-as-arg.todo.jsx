/*EXPECTED
foo
42
*/

native class G {
  class I1 {

    class I2.<T> {
      var foo : T;
      function constructor(value : T);
    }
  }
} = "{ I1: function(value) { this.foo = value; } }";

class _Main {
  static function f(o : G.I1.I2.<string>) : void {
    log o.foo;
  }
  static function g(o : G.I1.I2.<number>) : void {
    log o.foo;
  }

  static function main(args : string[]) : void {
    var x = new G.I1.I2.<string>("foo");
    _Main.f(x);

    var y = new G.I1.I2.<number>(42);
    _Main.g(y);
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
