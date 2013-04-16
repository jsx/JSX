/*EXPECTED
foo
*/
class _Main {
    static function f() : void {
        switch (1) {
        default:
          log "foo";
        }
        return;
    }

  static function main(args : string[]) : void {
    _Main.f();
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab:

