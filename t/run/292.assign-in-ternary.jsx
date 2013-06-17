/*EXPECTED
1
2
*/
class _Main {
  static function main(args : string[]) : void {
    var x;
    var t = true;
    t ? x = 1 : x = 2;
    log x;
    !t ? x = 1 : x = 2;
    log x;
  }
}
// vim: set expandtab tabstop=2:
