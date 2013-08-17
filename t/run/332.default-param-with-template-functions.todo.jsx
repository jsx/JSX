/*EXPECTED
10
-10
*/

class _Main {
  static function f.<T>(a : (T) -> T = (x) -> x) : void {
    log a(10);
  }

  static function main(args : string[]) : void {
    _Main.f.<number>();
    _Main.f.<number>((x) -> -x);
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
