/*EXPECTED
foo
*/
class _Main {
  static function main(args : string[]) : void {
    if (true) {
      if (true) {
        log "foo";
      }
      else if (true) {
        if (true) {
          log "xxx";
        }
      }
      else if (true) {
        log "bar";
        if (true) {
          log "baz";
        }
      }
      else {
        log "yyy";
      }
    }
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
