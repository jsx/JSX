/*EXPECTED
42
*/
class _Main {
  static function main(args : string[]) : void {
    [ [42] ].forEach((item) -> {
      log item.join(", ");
    });
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
