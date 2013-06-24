/*EXPECTED
f
1
42
foo
f
10
20
foo
f
100
200
bar
*/
class _Main {
  static function f(a : number, b : number = 42, c : string = "foo") : void {
    log "f";
    log a;
    log b;
    log c;
  }

  static function main(args : string[]) : void {
    _Main.f(1);
    _Main.f(10, 20);
    _Main.f(100, 200, "bar");
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
