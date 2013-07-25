/*EXPECTED
10
20
10
20
*/

class _Main {
  static function main(args : string[]) : void {
    var a = [
      10,
      20,
    ];
    var m = {
      a: 10,
      b: 20,
    };
    log a[0];
    log a[1];
    log m['a'];
    log m['b'];
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
