/*EXPECTED
11
22
*/

class Point {
  var x : number;
  var y : number;
  function constructor(x : number, y : number) {
    this.x = x;
    this.y = y;
    this.y = y; // twice
  }
}

class _Main {
  static function main(args : string[]) : void {
    var p = new Point(5 + 5, 10 + 10);
    p.x += 1;
    p.y += 2;
    log p.x;
    log p.y;
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
