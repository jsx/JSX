/*EXPECTED
foo
bar
*/
/*JSX_OPTS
--optimize inline
*/
final class _Main {
  static inline function f(s : string) : void {
    var x = s;
    log x;
    if (!x) _Main.f(x);
  }
  static function main(args : string[]) : void {
    _Main.f("foo");
    _Main.f("bar");
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
