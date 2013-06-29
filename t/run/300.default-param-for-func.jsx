/*EXPECTED
foo
bar
*/
class _Main {
  static function f(x : () -> void = () -> { log "foo"; }) : void {
    x();
  }

  static function main(args : string[]) : void {
    _Main.f();
    _Main.f(() -> { log "bar"; });
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
