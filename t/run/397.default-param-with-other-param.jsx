/*EXPECTED
f
1
43
f
10
20
f
1
43
*/
class _Main {
  static function f(a : number, b : number = a + 42) : void {
    log "f";
    log a;
    log b;
  }

  static function main(args : string[]) : void {
    _Main.f(1);
    _Main.f(10, 20);
    var i = 1;
    _Main.f(i++);
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
