/*EXPECTED
c
1
42
c
10
20
*/
class _Main {
  function constructor(a : number, b : number = 42) {
    log "c";
    log a;
    log b;
  }

  static function main(args : string[]) : void {
    new _Main(1);
    new _Main(10, 20);
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
