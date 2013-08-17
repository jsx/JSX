/*EXPECTED
42
*/
class _Main {
  static function f(a : int[]) : void {
    log a[0];
  }

  static function main(args : string[]) : void {
    var a : int = 42;
    _Main.f([a]);
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
