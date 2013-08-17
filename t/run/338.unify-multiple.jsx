/*EXPECTED
true
true
true
foo
bar
baz
true
foo
42

*/
class _Main {
  static function foo.<T, U, V>(a : T, b : U, c : V) : void {
    log a;
    log b;
    log c;
  }
  static function main(args : string[]) : void {
    _Main.foo(true, true, true);
    _Main.foo("foo", "bar", "baz");
    _Main.foo(true, "foo", 42);
  }
}

// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
