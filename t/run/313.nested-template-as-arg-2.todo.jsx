/*EXPECTED
foo
42
*/

native class G.<T> {
  class I1 {

    class I2 {
      var foo : T;
      function constructor(value : T);
    }
  }
} = "{ I1: function(value) { this.foo = value; } }";

class _Main {
  static function f(o : G.<string>.I1.I2) : void {
    log o.foo;
  }
  static function g(o : G.<number>.I1.I2) : void {
    log o.foo;
  }

  static function main(args : string[]) : void {
    var x = new G.<string>.I1.I2("foo");
    _Main.f(x);

    var y = new G.<number>.I1.I2(42);
    _Main.g(y);
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
