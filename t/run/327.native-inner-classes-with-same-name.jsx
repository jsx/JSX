/*EXPECTED
A
B
*/

native class A {
  class Foo {
    var bar : string;
  }
} = "{ Foo: function () { this.bar = 'A' } }";

native class B {
  class Foo {
    var bar : string;
  }
} = "{ Foo: function () { this.bar = 'B' } }";

class _Main {
  static function main(args : string[]) : void {
    log new A.Foo().bar;
    log new B.Foo().bar;
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
