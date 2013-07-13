/*EXPECTED
0
5
10
*/
/*JSX_OPTS
--optimize return-if,fold-const,inline
*/

// from https://github.com/jsx/JSX/issues/181
class A {
  static function clamp(value : number, min : number, max : number) : number {
    if (value <= min) {
      return min;
    } else if (value >= max) {
      return max;
    } else {
      return value;
    }
  }
}
class _Main {
  static function main (args : string[]) : void {
    log A.clamp(-1, 0, 10);
    log A.clamp(5, 0, 10);
    log A.clamp(20, 0, 10);
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:
