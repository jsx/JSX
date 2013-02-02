// https://github.com/jsx/JSX/issues/88
/*EXPECTED
false
false
*/

class _Main {
  static function main(args : string[]) : void {
    log true == (1 != 1);
    log true == (true == (1 != 1));
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:

