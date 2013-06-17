/*EXPECTED
1
*/
class _Main {
  static function main(args : string[]) : void {
    var x;
    if ((x = 1) || (x = 2)) log x;
  }
}
// vim: set expandtab tabstop=2:
