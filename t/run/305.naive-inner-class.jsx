/*EXPECTED
bar
*/

native class Native {
  class Inner {
    static var foo : string;
  }
} = "{ Inner: { foo: 'bar' } }";

class _Main {
  static function main(args : string[]) : void {
    log Native.Inner.foo;
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
