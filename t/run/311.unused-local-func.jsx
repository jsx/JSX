/*EXPECTED
foo
*/

class _Main {
  static function main(args : string[]) : void {
    function foobar(i : number) : number {
      return i + i;
    }

    log "foo";
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
