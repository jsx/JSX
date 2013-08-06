/*EXPECTED
10
-10
*/

class C.<T> {
  static function f(a : (T) -> T = (x) -> x) : void {
    log a(10);
  }
}

class _Main {

  static function main(args : string[]) : void {
    C.<number>.f();
    C.<number>.f((x) -> -x);
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
