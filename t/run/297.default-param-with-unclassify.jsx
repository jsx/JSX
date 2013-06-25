/*EXPECTED
a
0
0
b
10
20
*/
/*JSX_OPTS
--optimize lto,inline,unclassify
*/
class Point {
  var x : number;
  var y : number;

  function constructor(x : number = 0, y : number = 0) {
    this.x = x;
    this.y = y;
  }
}

class _Main {
  static function main(args : string[]) : void {
    var p = new Point;
    log "a";
    log p.x;
    log p.y;

    p = new Point(10, 20);
    log "b";
    log p.x;
    log p.y;
  }
}
// vim: set expandtab tabstop=2 shiftwidth=2 ft=jsx:
