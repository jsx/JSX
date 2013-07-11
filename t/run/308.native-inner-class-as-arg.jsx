/*EXPECTED
bar
*/

native class Native {
  class Inner {
    var foo : string;
  }
} = "{ Inner: function() { this.foo = 'bar'; } }";

class _Main {
  static function main(args : string[]) : void {
    _Main.f(new Native.Inner);
  }

  static function f(ni : Native.Inner) : void {
    log ni.foo;
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
