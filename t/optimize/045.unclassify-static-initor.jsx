/*JSX_OPTS
--optimize lto,unclassify
*/
/*EXPECTED
0,0
0,0
0,0
*/
class Point {
    var x = 0;
    var y = 0;
    function dump() : void {
        log this.x as string + "," + this.y as string;
    }
}
class _Main {
    static var sf = function (p : Point) : void {
        p.dump();
    };
    var mf = function (p : Point) : void {
        p.dump();
    };
    static function main(args : string[]) : void {
        var p = new Point;
        p.dump();
        _Main.sf(p);
        (new _Main).mf(p);
    }
}
