/*EXPECTED
foo
bar
*/
/*JSX_OPTS
--optimize inline
*/
class _Main {
  static inline function f(n : number) : void {
    if (n == 0)  _Main.g("foo");
    else         _Main.g("bar");
  }
  static function g(s : string) : void {
    log s;
  }
  static function main(args : string[]) : void {
    _Main.f(0);
    _Main.f(1);
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
