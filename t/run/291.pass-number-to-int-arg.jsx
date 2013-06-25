/*EXPECTED
42
*/
class _Main {
  static function takeInt(i : int) : void {
    log i;
  }
  static function main(args : string[]) : void {
    _Main.takeInt(42.5);
  }
}
// vim: set tabstop=2 shiftwidth=2 expandtab:
