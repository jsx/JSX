/*EXPECTED
null
null
null
null
*/

class P.<T> {
  static function f(a : Nullable.<T>) : void {
    log a;
  }
}

class _Main {
  static function main(args : string[]) : void {
    P.<variant>.f(null);
    P.<variant[]>.f(null);
    P.<Nullable.<variant>>.f(null);
    P.<Nullable.<variant[]>>.f(null);
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:

