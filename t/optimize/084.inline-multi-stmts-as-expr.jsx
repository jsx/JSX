/*EXPECTED
[foo]
[bar]
*/
/*JSX_OPTS
--optimize inline
*/
class _Main {
  static inline function f(s : string) : string {
    var x = "[" + s;
    var y = x + "]";
    return y;
  }
  static function main(args : string[]) : void {
    log _Main.f("foo");
    log _Main.f("bar");
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
